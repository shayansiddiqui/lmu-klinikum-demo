import numpy as np
import torch
from PIL import Image
from torch.autograd import Variable
import torch.nn.functional as F
import nibabel as nib

SEG_LABELS_LIST = {
    "relaynet": [
        {"id": 0, "name": "Region above the retina (RaR)", "rgb_values": [0, 0, 0]},
        {"id": 1, "name": "ILM: Inner limiting membrane", "rgb_values": [128, 0, 0]},
        {"id": 2, "name": "NFL-IPL: Nerve fiber ending to Inner plexiform layer", "rgb_values": [128, 128, 0]},
        {"id": 3, "name": "INL: Inner Nuclear layer", "rgb_values": [0, 0, 128]},
        {"id": 4, "name": "OPL: Outer plexiform layer", "rgb_values": [128, 0, 128]},
        {"id": 5, "name": "ONL-ISM: Outer Nuclear layer to Inner segment myeloid", "rgb_values": [0, 128, 128]},
        {"id": 6, "name": "ISE: Inner segment ellipsoid", "rgb_values": [128, 128, 128]},
        {"id": 7, "name": "OS-RPE: Outer segment to Retinal pigment epithelium", "rgb_values": [64, 0, 0]},
        {"id": 8, "name": "Region below RPE (RbR)", "rgb_values": [192, 0, 0]},
        {"id": 9, "name": "Fluid region", "rgb_values": [64, 128, 0]}],
    "quicknat": [
        {"id": 0, "name": "Background", "rgb_values": [0, 0, 0]},
        {"id": 1, "name": "WM left", "rgb_values": [245, 245, 245]},
        {"id": 2, "name": "GM left", "rgb_values": [205, 62, 78]},
        {"id": 3, "name": "WM right", "rgb_values": [128, 128, 128]},
        {"id": 4, "name": "GM right", "rgb_values": [128, 128, 0]},
        {"id": 5, "name": "Ventricle left", "rgb_values": [120, 18, 134]},
        {"id": 6, "name": "Cerebellar WM left", "rgb_values": [220, 248, 164]},
        {"id": 7, "name": "Cerebellar GM left", "rgb_values": [230, 148, 34]},
        {"id": 8, "name": "Thalamus left", "rgb_values": [0, 118, 14]},
        {"id": 9, "name": "Caudate left", "rgb_values": [122, 186, 220]},
        {"id": 10, "name": "Putamen left", "rgb_values": [236, 13, 176]},
        {"id": 11, "name": "Pallidum left", "rgb_values": [12, 48, 255]},
        {"id": 12, "name": "3rd ventricle", "rgb_values": [204, 182, 142]},
        {"id": 13, "name": "4th ventricle", "rgb_values": [42, 204, 164]},
        {"id": 14, "name": "Brainstem", "rgb_values": [119, 159, 176]},
        {"id": 15, "name": "Hippo left", "rgb_values": [220, 216, 20]},
        {"id": 16, "name": "Amygdala left", "rgb_values": [103, 255, 255]},
        {"id": 17, "name": "VentralDC left", "rgb_values": [165, 42, 42]},
        {"id": 18, "name": "Ventricle right", "rgb_values": [128, 0, 128]},
        {"id": 19, "name": "Cerebellar WM right", "rgb_values": [0, 128, 128]},
        {"id": 20, "name": "Cerebellar GM right", "rgb_values": [128, 0, 0]},
        {"id": 21, "name": "Thalamus right", "rgb_values": [0, 128, 0]},
        {"id": 22, "name": "Caudate right", "rgb_values": [0, 0, 128]},
        {"id": 23, "name": "Putamen right", "rgb_values": [64, 64, 64]},
        {"id": 24, "name": "Pallidum right", "rgb_values": [64, 64, 0]},
        {"id": 25, "name": "Hippo right", "rgb_values": [64, 0, 64]},
        {"id": 26, "name": "Amygdala right", "rgb_values": [0, 64, 64]},
        {"id": 27, "name": "VentralDC right", "rgb_values": [64, 0, 0]}
    ]}


def label_img_to_rgb(label_img, model_name):
    label_img = np.squeeze(label_img)
    labels = np.unique(label_img)
    label_infos = [l for l in SEG_LABELS_LIST[model_name] if l['id'] in labels]

    label_img_rgb = np.array([label_img,
                              label_img,
                              label_img]).transpose(1, 2, 0)
    for l in label_infos:
        mask = label_img == l['id']
        label_img_rgb[mask] = l['rgb_values']

    return label_img_rgb.astype(np.uint8)


def predict_segmentation(input_arr, model_name, header):
    batch_size = 10
    count = 0
    result = []
    model = torch.load('api/pytorch_models/' + model_name + '.model')

    input_arr = input_arr.reshape((-1, 1, input_arr.shape[-2], input_arr.shape[-1]))
    if model_name == "quicknat":
        input_arr = np.transpose(input_arr, [0, 1, 3, 2])
    while count <= input_arr.shape[0]:
        last_index = count + batch_size - 1

        if last_index > input_arr.shape[0]:
            last_index = input_arr.shape[0]
        out = model(Variable(torch.Tensor(input_arr[count:last_index]).cuda(), volatile=True))
        result.append(out)
        count += batch_size - 1
    result = torch.cat(result)
    result = F.softmax(result, dim=1)
    max_val, idx = torch.max(result, 1)
    idx = idx.data.cpu().numpy()

    color_map = [label for label in SEG_LABELS_LIST[model_name] if label["id"] != 0]
    stats = {'color_map': color_map}
    if model_name == "quicknat":
        idx = np.transpose(idx, [0, 2, 1])
        indexes, counts = np.unique(np.ravel(idx), return_counts=True)
        indexes = indexes[1:]
        counts = counts[1:]
        indexes = [str(i) for i in indexes]
        counts = [str(c) for c in counts]
        stats['volume_estimates'] = dict(zip(indexes, counts))

    # Create a new file
    nifti_img = nib.MGHImage(idx, np.eye(4), header=header)

    result = np.array([label_img_to_rgb(frame, model_name) for frame in idx])
    return {'result': result, 'stats': stats, 'nifti_img': nifti_img}
