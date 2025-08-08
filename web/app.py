from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
from zerogpt import Client
from zerogpt.utils.tools import image_to_prompt
import os

app = Flask(__name__)
client = Client()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def index():
    text_result = None
    image_result = None
    prompt_result = None

    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'text':
            prompt = request.form.get('text_prompt', '')
            instruction = request.form.get('instruction') or None
            think = bool(request.form.get('think'))
            uncensored = bool(request.form.get('uncensored'))
            text_result = client.send_message(
                prompt,
                instruction=instruction,
                think=think,
                uncensored=uncensored,
            )
        elif action == 'image':
            prompt = request.form.get('image_prompt', '')
            nsfw = bool(request.form.get('nsfw'))
            samples = int(request.form.get('samples') or 1)
            width = int(request.form.get('width') or 768)
            height = int(request.form.get('height') or 512)
            seed = int(request.form.get('seed') or -1)
            steps = int(request.form.get('steps') or 50)
            negative_prompt = request.form.get('negative_prompt', '')
            result = client.create_image(
                prompt,
                nsfw=nsfw,
                samples=samples,
                resolution=(width, height),
                seed=seed,
                steps=steps,
                negative_prompt=negative_prompt,
            )
            request_id = result.get('data', {}).get('request_id') if isinstance(result, dict) else None
            if request_id:
                images = client.get_image(request_id)
                image_result = images.images if hasattr(images, 'images') else None
        elif action == 'prompt':
            file = request.files.get('image_file')
            style = request.form.get('prompt_style', 'tag')
            if file and file.filename:
                filename = secure_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(path)
                prompt_result = image_to_prompt(path, prompt_style=style)
    return render_template(
        'index.html',
        text_result=text_result,
        image_result=image_result,
        prompt_result=prompt_result,
    )

if __name__ == '__main__':
    app.run(debug=True)
