from datetime import datetime

import imageio
import numpy as np
from flask import Blueprint
from flask import request
from utils import predict_relaynet

app = Blueprint('api', __name__, template_folder='templates')


@app.route("/resnet", methods=['GET', 'POST'])
def resnet():
    if request.method == 'POST':
        file = request.files['file']
        rawData = file.read()
        numpy_arr = np.frombuffer(rawData, dtype=np.float32)
        numpy_arr = numpy_arr.reshape(-1, 1, 512, 512)
        numpy_arr_reduced = numpy_arr.reshape(-1, 512, 512)
        img_seq = [img for img in numpy_arr_reduced]
        preview_filename = 'preview_' + str(datetime.now()) + '.mp4'
        imageio.mimwrite(preview_filename, img_seq, fps=1)
        file.close()
        # preview_file = open(preview_filename, 'rb');
        # img = Image.open(BytesIO(rawData))
        out_im = predict_relaynet(numpy_arr)
        print(out_im)
        # buffered = BytesIO()
        # out_im.save(buffered, format='PNG')
        return send_file(preview_filename, as_attachment=False)

    return render_template('http/method_not_allowed.html')


@app.route("/test", methods=['GET'])
def test():
    return 'Test endpoint active'
