FROM python:3.12-slim

# Minimal system deps needed before playwright installs its own
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Chromium + all its system dependencies via Playwright's own installer
RUN playwright install --with-deps chromium

# Copy application source
COPY . .

# Create screenshots directory
RUN mkdir -p /app/screenshots

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
