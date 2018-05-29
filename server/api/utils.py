import torch
from PIL import Image
import numpy as np


def predict_relaynet(input: Image):
    relaynet_model = torch.load('pytorch_models/relaynet_pytorch/models/relaynet_good.model')
    out = relaynet_model(Variable(torch.Tensor(np.array(input)).cuda(), volatile=True))
    max_val, idx = torch.max(out, 1)
    idx = idx.data.cpu().numpy()
    idx = np.squeeze(idx == 2)
    return Image.fromarray(idx)
