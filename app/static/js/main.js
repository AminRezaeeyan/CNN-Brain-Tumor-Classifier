document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('file');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const fileLabel = document.querySelector('.file-text');
    const fileUpload = document.querySelector('.file-upload');
    const errorMessage = document.querySelector('.error-message');
    const uploadForm = document.getElementById('upload-form');

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

    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file && file.size > 0) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    previewContainer.style.display = 'block';
                    fileLabel.textContent = file.name;
                    hideError();
                };
                reader.readAsDataURL(file);
            } else {
                showError();
            }
        });

        uploadForm.addEventListener('submit', function(e) {
            if (fileInput.files.length === 0 || fileInput.files[0].size === 0) {
                e.preventDefault();
                showError();
            } else {
                hideError();
            }
        });

        // Drag and drop functionality
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