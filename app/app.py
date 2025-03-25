from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Required for session management

# Load the model from the models directory
model = tf.keras.models.load_model('../models/best_model.keras')

# Class names for tumor types (in the order the model outputs them)
CLASSES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']

UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.resize((224, 224))  # Adjust size according to your model's input size
    img_array = np.array(img)
    # img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/result')
def result():
    # Get results from session
    results = session.get('prediction_results')
    if not results:
        return redirect(url_for('upload'))
    return render_template('result.html', results=results)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Create uploads directory if it doesn't exist
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            
            # Save the file
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            
            # Preprocess and predict
            processed_image = preprocess_image(filepath)
            predictions = model.predict(processed_image, verbose=0)  # Added verbose=0 to reduce output
            
            # Get the predicted class index and probability
            predicted_class_idx = np.argmax(predictions[0])
            predicted_class = CLASSES[predicted_class_idx]
            confidence = float(predictions[0][predicted_class_idx])
            
            # Create predictions dictionary with class names and probabilities
            predictions_dict = {}
            for i, class_name in enumerate(CLASSES):
                predictions_dict[class_name] = float(predictions[0][i])
            
            # Sort predictions by probability in descending order
            sorted_predictions = dict(sorted(predictions_dict.items(), key=lambda x: x[1], reverse=True))
            
            results = {
                'predictions': sorted_predictions,
                'image_path': '/static/uploads/' + file.filename,
                'predicted_class': predicted_class,
                'confidence': confidence
            }
            
            # Store results in session
            session['prediction_results'] = results
            return jsonify(results)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True) 