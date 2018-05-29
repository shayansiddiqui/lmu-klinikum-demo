import base64

from flask import Blueprint
from flask import request
from utils import predict_relaynet

app = Blueprint('api', __name__, template_folder='templates')


@app.route("/resnet", methods=['GET', 'POST'])
def resnet():
    if request.method == 'POST':
        file = request.files['file']
        rawData = file.read()
        file.close()
        imgSize = (500, 500)
        img = Image.fromstring('L', imgSize, rawData, 'raw', 'F;16')
        out_im = predict_relaynet(img)
        return base64.b64encode(out_im)

    return render_template('http/method_not_allowed.html')


@app.route("/test", methods=['GET'])
def test():
    return 'Test endpoint active'
