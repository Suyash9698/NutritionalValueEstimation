# SSD_Project_19
# Weigh My Plate


## Overview

Weigh My Plate is a project aimed at estimating the weight of food portions using machine learning. The project utilizes a MERN (MongoDB, Express.js, React, Node.js) stack for its frontend and backend components. Additionally, it incorporates a Python script responsible for the machine learning aspect, leveraging various libraries such as OpenCV, PyTorch, NumPy, Matplotlib, and more.

## Features

- **ML-powered Food Weight Estimation**: Utilizes machine learning algorithms to estimate the weight of food portions.
- Uses MIDAS for depth estimation along with FasterRCNN and YoloV5 model for food item detection.
- **MERN Stack**: Implements MongoDB, Express.js, React, and Node.js for a full-stack application.
- **Python Script for ML**: Contains Python code that utilizes OpenCV, PyTorch, NumPy, and Matplotlib for image processing and machine learning tasks.

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB
- Python

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
# Configure MongoDB and environment variables as needed
npm start
```

### Python ML Script Setup

Ensure you have the following Python libraries installed:

- `cv2`
- `torch`
- `urllib`
- `numpy`
- `matplotlib`
- `roboflow`

One can install these libraries using `pip`:

```bash
pip install opencv-python torch torchvision numpy matplotlib roboflow
```

Run the Python script for the ML component:

```bash
python newtest.py
```

## Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/improvement`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/improvement`).
6. Create a new Pull Request.



