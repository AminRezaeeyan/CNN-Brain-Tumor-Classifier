document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const elements = {
        fileInput: document.getElementById('file'),
        previewContainer: document.getElementById('preview-container'),
        imagePreview: document.getElementById('image-preview'),
        fileLabel: document.querySelector('.file-text'),
        fileUpload: document.querySelector('.file-upload'),
        errorMessage: document.querySelector('.error-message'),
        uploadForm: document.getElementById('upload-form'),
        analyzeBtn: document.querySelector('.analyze-btn'),
        dropZone: document.querySelector('.file-upload')
    };

    let hasUploaded = false;

    // Constants
    const MIN_DIMENSION = 224;
    const MAX_DIMENSION = 4096;
    const MAX_ASPECT_RATIO = 1.5;

    // Utility Functions
    function showError(message) {
        elements.fileUpload.classList.add('error');
        elements.fileLabel.classList.add('error');
        elements.errorMessage.textContent = message;
        elements.errorMessage.classList.add('show');
        elements.fileLabel.textContent = 'Choose a file or drag it here';
        elements.previewContainer.style.display = 'none';
    }

    function hideError() {
        elements.fileUpload.classList.remove('error');
        elements.fileLabel.classList.remove('error');
        elements.errorMessage.classList.remove('show');
    }

    function updateImageDimensions(width, height) {
        const dimensionsElement = document.querySelector('.image-dimensions');
        dimensionsElement.textContent = `Dimensions: ${width} × ${height} pixels`;
    }

    function validateImage(width, height) {
        const aspectRatio = Math.max(width, height) / Math.min(width, height);
        
        if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
            return `Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels`;
        } else if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            return `Image dimensions cannot exceed ${MAX_DIMENSION}x${MAX_DIMENSION} pixels`;
        } else if (aspectRatio > MAX_ASPECT_RATIO) {
            return 'Image aspect ratio should be close to 1:1 (square)';
        }
        return null;
    }

    function truncateFileName(fileName, maxLength = 30) {
        if (fileName.length <= maxLength) return fileName;
        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.slice(0, -(extension.length + 1));
        const truncatedName = nameWithoutExt.slice(0, maxLength - 3);
        return `${truncatedName}...${extension}`;
    }

    // Loading State Management
    function showLoading() {
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
        elements.analyzeBtn.disabled = true;
    }

    function hideLoading() {
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
        elements.analyzeBtn.disabled = false;
    }

    // File Upload Handling
    function handleFileUpload(file) {
        if (!file || file.size === 0) {
            hasUploaded = false;
            showError('Please select a file to upload');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function() {
                const width = img.width;
                const height = img.height;
                const error = validateImage(width, height);
                
                if (error) {
                    showError(error);
                    return;
                }
                
                elements.imagePreview.src = e.target.result;
                elements.previewContainer.style.display = 'block';
                elements.fileLabel.textContent = truncateFileName(file.name);
                elements.fileLabel.title = file.name;
                updateImageDimensions(width, height);
                hasUploaded = true;
                hideError();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Form Submission
    function handleFormSubmit(e) {
        e.preventDefault();
        const file = elements.fileInput.files[0];
        
        if (!file || file.size === 0) {
            showError('Please select a file to upload');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const width = img.width;
                const height = img.height;
                const error = validateImage(width, height);
                
                if (error) {
                    showError(error);
                    return;
                }

                const formData = new FormData(elements.uploadForm);
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
                    sessionStorage.setItem('predictionResults', JSON.stringify(data));
                    window.location.href = '/result';
                })
                .catch(error => {
                    hideLoading();
                    showError(error.message);
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Drag and Drop Handling
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        elements.dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
        elements.dropZone.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        elements.fileInput.files = dt.files;
        handleFileUpload(file);
    }

    // Event Listeners
    if (elements.fileInput) {
        elements.fileInput.addEventListener('change', function (e) {
            handleFileUpload(e.target.files[0]);
        });

        elements.uploadForm.addEventListener('submit', handleFormSubmit);

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            elements.dropZone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            elements.dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            elements.dropZone.addEventListener(eventName, unhighlight, false);
        });

        elements.dropZone.addEventListener('drop', handleDrop, false);
    }
});