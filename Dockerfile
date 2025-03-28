FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app and model
COPY app/ ./app/
COPY models/best_model.keras ./models/

# Create uploads directory
RUN mkdir -p app/static/uploads

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]