from datetime import datetime

import imageio
import numpy as np
from flask import Blueprint
from flask import request
from flask import send_file, send_from_directory
from utils import predict_segmentation
import io
import base64
from flask import jsonify
import os
from flask import after_this_request
import subprocess as sp
import nibabel as nib
from werkzeug.utils import secure_filename

app = Blueprint('api', __name__, template_folder='templates')

ALLOWED_EXTENSIONS = {
    'relaynet': {'jpg', 'nii', 'nii.gz', 'mgz'},
    'quicknat': {'nii', 'nii.gz', 'mgz'}
}

file_prefixes = {
    'temporary': 'tmp',
    'preview': 'pre',
    'conform': 'c',
    'predict': 'pred',
    'segment_result': 'seg_result'
}

sample_files = {
    'quicknat': 'quicknat.mgz',
    'relaynet': 'relaynet.nii'
}

MRI_CONVERT_PATH = '/usr/local/freesurfer/bin/'


def _allowed_file(model, filename):
    return '.' in filename and \
           ".".join(filename.split('.')[1:]).lower() in ALLOWED_EXTENSIONS[model]


def _check_save_file(request, timestamp, model_name, type):
    if 'file' not in request.files:
        return None

    file = request.files['file']

    if file.filename == '':
        return None
    if file and _allowed_file(model_name, file.filename):
        filename = secure_filename(file.filename)
        filepath = "_".join([file_prefixes[type], timestamp, filename])
        file.save(filepath)
        return {"file": file, "file_path": filepath}


def run_mri_convert(file_dict):
    file_path = "_".join([file_prefixes["conform"], file_dict["file_path"]])
    return_code = sp.call(
        [MRI_CONVERT_PATH + "mri_convert", "--conform", file_dict["file_path"], file_path], timeout=300)
    if return_code != 0:
        return None
    return file_path


@app.route("/preview/<model_name>", methods=['GET', 'POST'])
def preview(model_name):
    if request.method == 'POST':
        timestamp = str(datetime.now()).replace(" ", "_")
        file_dict = _check_save_file(request, timestamp, model_name, 'preview')
        if file_dict is not None:
            # TODO:Need to support more file types. Need a switcher
            file_path = file_dict["file_path"]
            if model_name == "quicknat":
                file_path = run_mri_convert(file_dict)

            nifty_file = nib.load(file_path)
            numpy_arr = nifty_file.get_data()
            numpy_arr_reduced = numpy_arr.reshape(-1, numpy_arr.shape[-2], numpy_arr.shape[-1])
            if model_name == "quicknat":
                numpy_arr_reduced = np.transpose(numpy_arr_reduced, [2, 1, 0])
            img_seq = [img for img in numpy_arr_reduced]

            preview_filename = "_".join([file_prefixes['preview'], timestamp, '.mp4'])
            imageio.mimwrite(preview_filename, img_seq, fps=5)
            preview_file = open(preview_filename, 'rb')
            preview_file_data = preview_file.read()

            @after_this_request
            def remove_file(response):
                try:
                    os.remove(preview_filename)
                    os.remove(file_dict["file_path"])
                    preview_file.close()
                    file_dict["file"].close()
                    if file_dict["file_path"] != file_path:
                        os.remove(file_path)
                except Exception as error:
                    app.logger.error("Error removing or closing downloaded file handle", error)
                return response

            return jsonify({'body': base64.b64encode(preview_file_data).decode("utf-8")})

    return render_template('http/method_not_allowed.html')


@app.route('/downloads/<path:path>')
def download(path):
    # @after_this_request
    # def remove_file(response):
    #    try:
    #        os.remove("downloads/" + path)
    #    except Exception as error:
    #        app.logger.error("Error removing or closing downloaded file handle", error)
    #    return response

    return send_from_directory('downloads', path)


@app.route("/sample/<model_name>", methods=['GET', 'POST'])
def use_sample_files(model_name):
    return send_from_directory('sample_files', sample_files[model_name])


@app.route("/segment/<model_name>", methods=['GET', 'POST'])
def segment(model_name):
    if request.method == 'POST':
        timestamp = str(datetime.now()).replace(" ", "_")
        file_dict = _check_save_file(request, timestamp, model_name, 'temporary')
        if file_dict is not None:
            # TODO:Need to support more file types. Need a switcher
            file_path = file_dict["file_path"]
            if model_name == 'quicknat':
                file_path = run_mri_convert(file_dict)

            nifty_file = nib.load(file_path)
            numpy_arr = nifty_file.get_data()
            numpy_arr = numpy_arr.reshape(-1, numpy_arr.shape[-2], numpy_arr.shape[-1])
            if model_name == 'quicknat':
                numpy_arr = np.transpose(numpy_arr, [2, 1, 0])

            out = predict_segmentation(numpy_arr, model_name, nifty_file.header)
            out_im = out['result']
            stats = out['stats']
            print(stats)
            nifti_img = out['nifti_img']
            nifti_img_path = "downloads/" + "_".join([file_prefixes['segment_result'], timestamp]) + ".mgz"

            nib.save(nifti_img, nifti_img_path)

            result_img_seq = [img for img in out_im]

            result_filename = '_'.join([file_prefixes['predict'], timestamp, '.mp4'])
            imageio.mimwrite(result_filename, result_img_seq, fps=5)
            result_file = open(result_filename, 'rb')
            result_file_data = result_file.read()
            result_file.close()

            @after_this_request
            def remove_file(response):
                try:
                    os.remove(result_filename)
                    os.remove(file_dict["file_path"])
                    result_file.close()
                    file_dict["file"].close()
                    if file_dict["file_path"] != file_path:
                        os.remove(file_path)
                except Exception as error:
                    app.logger.error("Error removing or closing downloaded file handle", error)
                return response

            return jsonify({'seg_result': base64.b64encode(result_file_data).decode("utf-8"), 'stats': stats,
                            "download_path": nifti_img_path})

        return render_template('http/method_not_allowed.html')

    @app.route("/test", methods=['GET'])
    def test():
        return 'Test endpoint active'
