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

echo "🚀 Building and starting containers..."

# Run docker-compose
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo "🎉 Open http://localhost:8080 in your browser to start brewing!"
else
    echo ""
    echo "❌ Something went wrong. Please check the logs above."
fi
