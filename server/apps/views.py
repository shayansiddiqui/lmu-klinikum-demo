from flask import Blueprint
from flask import request

app = Blueprint('apps', __name__, template_folder='templates')


@app.route("/resnet", methods=['POST'])
def resnet():
    print(request.files)
    f = request.files['the_file']
    print(f.filename)
    return 'Inside the python server'
