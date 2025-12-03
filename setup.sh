#!/bin/bash

echo "☕ Brew Notes Cafe - Installation Script"
echo "======================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "👉 https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed (or part of Docker CLI)
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    echo "👉 https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed."

# Ensure database file exists for volume mounting
DB_FILE="./python-backend/coffee.db"
if [ ! -f "$DB_FILE" ]; then
    echo "⚠️  Database file not found. Creating a new one..."
    touch "$DB_FILE"
fi

# Load environment variables if .env exists
if [ -f .env ]; then
    echo "📝 Loading custom port configuration from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default ports if not specified
FRONTEND_PORT=${FRONTEND_PORT:-8080}
BACKEND_PORT=${BACKEND_PORT:-8000}

echo "🚀 Building and starting containers..."
echo "   Frontend will be available on port: $FRONTEND_PORT"
echo "   Backend will be available on port: $BACKEND_PORT"

# Run docker-compose
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo "🎉 Open http://localhost:$FRONTEND_PORT in your browser to start brewing!"
    echo "📡 Backend API: http://localhost:$BACKEND_PORT"
else
    echo ""
    echo "❌ Something went wrong. Please check the logs above."
fi
