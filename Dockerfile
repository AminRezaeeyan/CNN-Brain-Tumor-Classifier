FROM python:3.9-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app directory and other top-level items
COPY app/ ./app/
COPY models/ ./models/

# Set Flask app to point to your app package
ENV FLASK_APP=app.app

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]