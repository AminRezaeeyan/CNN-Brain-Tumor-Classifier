document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const fileLabel = document.querySelector('.file-text');
    const fileUpload = document.querySelector('.file-upload');
    const errorMessage = document.querySelector('.error-message');
    const uploadForm = document.getElementById('upload-form');
    const analyzeBtn = document.querySelector('.analyze-btn');
    
    let hasUploaded = false;

    function showError() {
        fileUpload.classList.add('error');
        fileLabel.classList.add('error');
        errorMessage.classList.add('show');
        fileLabel.textContent = 'Choose a file or drag it here';
        previewContainer.style.display = 'none';
    }

    function hideError() {
        fileUpload.classList.remove('error');
        fileLabel.classList.remove('error');
        errorMessage.classList.remove('show');
    }

    function showLoading() {
        // Create loading container if it doesn't exist
        let loadingContainer = document.getElementById('loading-container');
        if (!loadingContainer) {
            loadingContainer = document.createElement('div');
            loadingContainer.id = 'loading-container';
            loadingContainer.innerHTML = `
                <div class="loading-spinner"></div>
                <p class="loading-text">Analyzing MRI scan...</p>
            `;
            document.body.appendChild(loadingContainer);
        }
        loadingContainer.style.display = 'flex';
        analyzeBtn.disabled = true;
    }

    function hideLoading() {
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        analyzeBtn.disabled = false;
    }

    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file && file.size > 0) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    previewContainer.style.display = 'block';
                    fileLabel.textContent = file.name;
                    hasUploaded = true;
                    hideError();
                };
                reader.readAsDataURL(file);
            } else {
                hasUploaded = false;
                showError();
            }
        });

        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!fileInput.files.length || (fileInput.files[0] && fileInput.files[0].size === 0)) {
                showError();
                return;
            }

            const formData = new FormData(uploadForm);
            showLoading();

            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                // Store the results in sessionStorage
                sessionStorage.setItem('predictionResults', JSON.stringify(data));
                // Redirect to result page
                window.location.href = '/result';
            })
            .catch(error => {
                hideLoading();
                errorMessage.textContent = error.message;
                showError();
            });
        });

        const dropZone = document.querySelector('.file-upload');
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('highlight');
        }

        function unhighlight(e) {
            dropZone.classList.remove('highlight');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            fileInput.files = dt.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    }
});