Project Name

# Overview
This project uses a Vision Transformer Model to detect the ripeness and freshness of fruits (Banana, Apple, Orange) in images. The frontend is built with React and Tailwind CSS, while the backend leverages Python for image processing and data handling.

# Project Structure
```
__pycache__/
dataset/
frontend/
    public/
    src/
        assets/
        components/
        pages/
        app.jsx
main.py
ocr/
    doctr/
    gemini/
processed_images/
utils/
vision/
```

# Installation

## Conda Environment
1. **Create and activate the conda environment:**
     ```sh
     conda create -n qualiscan python=3.10
     conda activate qualiscan
     ```

## Install Packages
1. **Install packages with conda:**
     ```sh
     conda install -c conda-forge fastapi uvicorn pillow opencv
     ```
2. **Install remaining packages with pip:**
     ```sh
     echo "python-dotenv\nrequests" > requirements.txt
     pip install -r requirements.txt
     ```

# Usage

## Running the Frontend
1. **Navigate to the frontend directory:**
     ```sh
     cd frontend
     ```
2. **Install dependencies:**
     ```sh
     pnpm install
     ```
3. **Start the development server:**
     ```sh
     pnpm run dev
     ```

## Running the Backend
1. **Run the main script:**
     ```sh
     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
     ```

# Key Files and Directories
- **frontend/src/components:** Contains React components.
- **image_process.py:** Handles image processing logic.
- **ocr/ocr.py:** Contains OCR-related functions.
- **utils/expiry_date_checker.py:** Utility for checking expiry dates.
- **vision/config.py:** Configuration for vision-related tasks.

# Contributing
1. **Fork the repository.**
2. **Create a new branch:**
     ```sh
     git checkout -b feature-branch
     ```
3. **Commit your changes:**
     ```sh
     git commit -m 'Add new feature'
     ```
4. **Push to the branch:**
     ```sh
     git push origin feature-branch
     ```
5. **Open a Pull Request.**

# License
This project is licensed under the MIT License.

# Prompt for Vision Transformer Model

## Task Overview
Detect the ripeness and freshness of bananas, apples, and oranges in images. Classify each fruit as "Fresh," "Ripe," "Overripe," or "Spoiled".

## Input
An image containing one or more of the following fruits: bananas, apples, or oranges.

## Instructions

### General Approach
- **Segmentation & Identification:** Identify and segment each fruit.
- **Color Analysis:** Assess overall color for freshness and ripeness.
- **Texture Evaluation:** Analyze surface texture for blemishes or softness.
- **Shape Detection:** Detect contour and shape for irregularities.
- **Output Format:** Classify each fruit and provide a confidence score.

### Detailed Analysis for Each Fruit
- **Bananas:**
    - **Fresh:** Bright yellow, minimal brown spots.
    - **Ripe:** Yellow with some brown spots.
    - **Overripe:** Predominantly brown, mushy.
    - **Spoiled:** Black, moldy.
- **Apples:**
    - **Fresh:** Vibrant color, no spots.
    - **Ripe:** Mostly vibrant, few blemishes.
    - **Overripe:** Discoloration, large patches.
    - **Spoiled:** Shriveling, mold.
- **Oranges:**
    - **Fresh:** Bright orange, uniform color.
    - **Ripe:** Slightly duller, minimal blemishes.
    - **Overripe:** Brownish spots, uneven color.
    - **Spoiled:** Dark patches, mold.

## Output Format
```json
[
    {
        "Fruit": "Banana",
        "Classification": "Fresh",
        "Confidence_Score": 0.95
    },
    {
        "Fruit": "Apple",
        "Classification": "Overripe",
        "Confidence_Score": 0.85
    },
    {
        "Fruit": "Orange",
        "Classification": "Ripe",
        "Confidence_Score": 0.92
    }
]
```

## Advanced Instructions
- **Focus on high-quality segmentation.**
- **Leverage multi-scale analysis.**
- **Adapt confidence thresholds dynamically.**

