# Brew Notes Cafe ☕

**Brew Notes Cafe** is a modern, elegant application for tracking your coffee brewing recipes. Whether you're dialing in a new espresso bean or perfecting your V60 pour-over, this app helps you log every detail to achieve the perfect cup.

## ✨ Features

- **Recipe Tracking**: Log input weight, output weight, grind size, brewing time, and more.
- **Taste Rating**: Rate your brews and note flavor complexity.
- **Bean Management**: Keep track of different coffee beans.
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile.
- **Privacy Focused**: All data is stored locally on your device (or server).

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python (FastAPI), SQLite
- **Containerization**: Docker, Docker Compose, Nginx

## 🚀 Installation

The easiest way to run this project is using Docker. This works on any system with Docker installed, including Raspberry Pi.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed on your system.

### Quick Start (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/brew-notes-cafe.git
   cd brew-notes-cafe
   ```

2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

3. **Open your browser:**
   Go to [http://localhost:8080](http://localhost:8080)

### Manual Docker Start

If you prefer running commands manually:

```bash
docker-compose up -d --build
```

### Development Setup

If you want to contribute or run without Docker:

1. **Backend**:
   ```bash
   cd python-backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.  
