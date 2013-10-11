from flask import Flask, render_template
from flask.ext.assets import Environment, Bundle

app = Flask(__name__)

# webassets, CSS compiler
assets = Environment(app)
assets.url = app.static_url_path
scss = Bundle('css/main.scss', filters='pyscss', output='css/main.css')
assets.register('scss_main', scss)

# js = Bundle('jquery-2.0.3-min.js', 'main.js', 'backbone-min.js'

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)  # use debug flag for development only
