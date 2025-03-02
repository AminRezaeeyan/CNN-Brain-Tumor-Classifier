# 🧠 Brain Tumor Classifier (98.17% accuracy)

&#x20; &#x20;

A powerful Convolutional Neural Network (CNN) model designed to classify brain tumors into four categories: **glioma, meningioma, notumor, and pituitary**. This model achieves **state-of-the-art performance** with an impressive **98.17% accuracy** on the test set. Built with **TensorFlow/Keras**, it leverages **VGG-inspired architecture, real-time data augmentation, and advanced training strategies** to ensure robustness and reliability.

1. **Glioma**  
   Gliomas are tumors originating from glial cells, the supportive cells around neurons in the brain. They range from low-grade (slow-growing) to high-grade (malignant, e.g., glioblastoma) and are the most common primary brain tumors. On MRI, they often appear irregular with varying contrast, influenced by grade and surrounding edema. Accurate detection is vital due to differing treatment needs.

2. **Meningioma**  
   Meningiomas arise from the meninges, the protective layers covering the brain and spinal cord. Typically benign and slow-growing, some can become malignant or symptomatic due to pressure on brain structures. In MRI scans, they appear as well-defined, round masses with uniform contrast enhancement, aiding their identification for surgical or monitoring decisions.

3. **Pituitary**  
   Pituitary tumors develop in the pituitary gland, which regulates hormones. Usually benign (e.g., pituitary adenomas), they can disrupt hormonal balance or affect vision by pressing on optic nerves. On MRI, they are located near the sella turcica and show distinct enhancement, making classification key for managing endocrine symptoms.

4. **No-tumor**  
   This category includes MRI scans with no tumor or abnormal growth, serving as the control group. These images depict normal brain anatomy or minor non-tumor conditions (e.g., cysts). They lack the irregular masses or distortions seen in tumor cases, ensuring the CNN can differentiate healthy from pathological scans effectively.


## Why It Matters
In the realm of medical diagnostics, accuracy and reliability can mean the difference between life and death. The CNN Brain Tumor Classifier rises to this challenge, offering a dependable, automated solution that supports radiologists and clinicians. Extensive experimentation with alternative architectures confirmed this design as the optimal choice, refined through data augmentation and strategic training to meet the stringent demands of brain tumor classification.

---

## 📸 Model Overview

### Model Architecture
![Architecture of model](https://github.com/AminRezaeeyan/CNN-Brain-Tumor-Classifier/blob/main/images/architecture1.svg)
### Learning Curve
![Learning Curve](https://github.com/AminRezaeeyan/CNN-Brain-Tumor-Classifier/blob/main/images/learning_curve.png)
### Dataset Samples
![Dataset Samples](https://github.com/AminRezaeeyan/CNN-Brain-Tumor-Classifier/blob/main/images/samples.png)

---

## 🚀 Key Features

- **High Accuracy:** 98.17% test accuracy with strong generalization.
- **Robust Metrics:** High precision, recall, and F2-score, ensuring reliability for medical applications.
- **Optimized CNN Architecture:** Inspired by VGG, utilizing small 3x3 kernels for efficiency.
- **Advanced Training Strategies:** Early stopping, model checkpointing, and dynamic learning rate scheduling.
- **Data Augmentation:** Real-time transformations (rotations, flips) improve generalization.
- **Pre-trained Model Available:** Download `best_model.keras` from the `models/` folder.

Iterative testing of alternative architectures—including batch normalization, 1x1 kernels from Inception, large kernels from MobileNet, and separable convolutions—confirmed that the chosen design, enhanced by small kernels, dropout regularization, and data augmentation, outperformed other approaches. This careful refinement, paired with on-the-fly augmentation and strategic callbacks, tailored the classifier to the demands of brain tumor diagnosis. Ultimately, the brain tumor classifier delivers a powerful, dependable solution for early detection, poised to support improved patient outcomes in clinical settings.

### Training Strategies

- **On-the-fly Augmentation:** Real-time transformations, such as rotations and flips, enhance model robustness without requiring extra storage.

- **Early Stopping:** Prevents overfitting by halting training when validation performance ceases to improve.

- **Learning Rate Scheduling:** Dynamically adjusts the learning rate to optimize convergence and avoid unnecessary fluctuations.

- **High Accuracy:** 98.17% test accuracy with strong generalization.

- **Robust Metrics:** High precision, recall, and F2-score, ensuring reliability for medical applications.

- **Optimized CNN Architecture:** Inspired by VGG, utilizing small 3x3 kernels for efficiency.

- **Advanced Training Strategies:** Early stopping, model checkpointing, and dynamic learning rate scheduling.

- **Data Augmentation:** Real-time transformations (rotations, flips) improve generalization.

- **Pre-trained Model Available:** Download `best_model.keras` from the `models/` folder.

---

## 📊 Performance Metrics

| Metric        | Score  |
| ------------- | ------ |
| **Accuracy**  | 98.17% |
| **Precision** | 98.17% |
| **Recall**    | 98.17% |
| **F1 Score**  | 98.17% |
| **F2 Score**  | 98.17% |

### Class-wise Performance

| Class          | Precision | Recall | F1 Score |
| -------------- | --------- | ------ | -------- |
| **Glioma**     | 98.98%    | 97.33% | 98.15%   |
| **Meningioma** | 96.72%    | 96.41% | 96.56%   |
| **Notumor**    | 98.29%    | 99.51% | 98.90%   |
| **Pituitary**  | 98.67%    | 99.00% | 98.84%   |

---

## 📂 Installation & Usage

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AminRezaeeyan/CNN-Brain-Tumor-Classifier.git
   cd CNN-Brain-Tumor-Classifier
   ```
2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Load the Pre-trained Model**
   ```python
   from tensorflow.keras.models import load_model
   ```

import cv2 import numpy as np model = load_model('models/best_model.keras')
4. **Run Inference**
```python
import cv2
import numpy as np

def preprocess_image(image_path):
 image = cv2.imread(image_path)
 image = cv2.resize(image, (224, 224))
 image = np.expand_dims(image, axis=0)
 return image

image = preprocess_image('path/to/image.jpg')
prediction = model.predict(image)
print("Predicted Class:", np.argmax(prediction))
````

---

## 🔮 Future Work

- **Developing a User Interface (UI) for easier interaction.**
- **Exploring deployment options such as Flask or Streamlit for web-based access.**

---

## 🤝 Contributions

Contributions are welcome! If you’d like to improve the model, enhance the UI, or optimize performance, feel free to:

1. **Fork the repo**
2. **Create a new branch** (`feature-branch`)
3. **Commit your changes**
4. **Open a Pull Request**

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

Special thanks to the contributors and the open-source community for their support in developing deep learning models for medical applications.
