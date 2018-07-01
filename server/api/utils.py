import numpy as np
import torch
from PIL import Image
from torch.autograd import Variable

SEG_LABELS_LIST = [
    {"id": -1, "name": "void", "rgb_values": [0, 0, 0]},
    {"id": 0, "name": "Region above the retina (RaR)", "rgb_values": [128, 0, 0]},
    {"id": 1, "name": "ILM: Inner limiting membrane", "rgb_values": [0, 128, 0]},
    {"id": 2, "name": "NFL-IPL: Nerve fiber ending to Inner plexiform layer", "rgb_values": [128, 128, 0]},
    {"id": 3, "name": "INL: Inner Nuclear layer", "rgb_values": [0, 0, 128]},
    {"id": 4, "name": "OPL: Outer plexiform layer", "rgb_values": [128, 0, 128]},
    {"id": 5, "name": "ONL-ISM: Outer Nuclear layer to Inner segment myeloid", "rgb_values": [0, 128, 128]},
    {"id": 6, "name": "ISE: Inner segment ellipsoid", "rgb_values": [128, 128, 128]},
    {"id": 7, "name": "OS-RPE: Outer segment to Retinal pigment epithelium", "rgb_values": [64, 0, 0]},
    {"id": 8, "name": "Region below RPE (RbR)", "rgb_values": [192, 0, 0]},
    {"id": 9, "name": "Fluid region", "rgb_values": [64, 128, 0]}];


def label_img_to_rgb(label_img):
    label_img = np.squeeze(label_img)
    labels = np.unique(label_img)
    label_infos = [l for l in SEG_LABELS_LIST if l['id'] in labels]

    label_img_rgb = np.array([label_img,
                              label_img,
                              label_img]).transpose(1, 2, 0)
    for l in label_infos:
        mask = label_img == l['id']
        label_img_rgb[mask] = l['rgb_values']

    return label_img_rgb.astype(np.uint8)


def predict_relaynet(input_arr):
    relaynet_model = torch.load('api/pytorch_models/relaynet_good_new.model',
                                map_location=lambda storage, location: storage)
    # input_arr = np.array(input);
    input_arr = input_arr.reshape((-1, 1, input_arr.shape[-2], input_arr.shape[-1]))
    print(input_arr.min(), input_arr.max())
    out = relaynet_model(Variable(torch.Tensor(input_arr), volatile=True))
    max_val, idx = torch.max(out, 1)
    idx = idx.data.cpu().numpy()

    result = np.array([label_img_to_rgb(frame) for frame in idx])
    # idx = label_img_to_rgb(idx)
    # idx = np.squeeze(idx == 2).astype('uint8')
    # print(idx.min(), idx.max())
    return result
