from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Required for session management

# Model configuration

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'best_model.keras')
CLASSES = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}

# Load the trained model
model = tf.keras.models.load_model(MODEL_PATH)

# Configure upload settings
UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess the image for model input."""
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224))
    return np.expand_dims(np.array(img), axis=0)

def calculate_aspect_ratio(width, height):
    """Calculate and determine aspect ratio status."""
    ratio = max(width, height) / min(width, height)
    status = "Optimal" if ratio <= 1.5 else "Acceptable" if ratio <= 2.0 else "Not optimal"
    return ratio, status

def get_image_details(filepath):
    """Extract image details for display."""
    img = Image.open(filepath)
    return {
        'width': img.width,
        'height': img.height,
        'format': img.format.upper(),
        'mode': img.mode,
        'size': f"{os.path.getsize(filepath) / 1024:.1f} KB"
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/result')
def result():
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
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        # Create uploads directory and save file
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        # Process image and get predictions
        processed_image = preprocess_image(filepath)
        predictions = model.predict(processed_image, verbose=0)
        
        # Get prediction details
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = CLASSES[predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])
        
        # Create sorted predictions dictionary
        predictions_dict = {CLASSES[i]: float(predictions[0][i]) for i in range(len(CLASSES))}
        sorted_predictions = dict(sorted(predictions_dict.items(), key=lambda x: x[1], reverse=True))
        
        # Get image details
        img_details = get_image_details(filepath)
        aspect_ratio, aspect_ratio_status = calculate_aspect_ratio(img_details['width'], img_details['height'])
        
        # Prepare results
        results = {
            'predictions': sorted_predictions,
            'image_path': '/static/uploads/' + file.filename,
            'predicted_class': predicted_class,
            'confidence': confidence,
            'original_width': img_details['width'],
            'original_height': img_details['height'],
            'aspect_ratio': aspect_ratio,
            'aspect_ratio_status': aspect_ratio_status,
            'file_size': img_details['size'],
            'file_format': img_details['format'],
            'color_mode': img_details['mode']
        }
        
        session['prediction_results'] = results
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 