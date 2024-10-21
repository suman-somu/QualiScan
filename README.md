# QualiScan

This project uses a Vision Transformer Model to detect the ripeness and freshness of fruits (Banana, Apple, Orange) in images and recognize FMCG products. The frontend is built with React and Tailwind CSS, while the backend leverages Python for image processing and data handling.

## Project Structure

```
__pycache__/
.env
.gitignore
dataset/
frontend/
    .gitignore
    eslint.config.js
    index.html
    package.json
    pnpm-lock.yaml
    postcss.config.cjs
    public/
    README.md
    src/
        App.jsx
        assets/
        components/
            ...
        index.css
        main.jsx
        output.css
        pages/
    tailwind.config.js
    vite.config.js
main.py
README.md
requirements.txt
utils/
    expiry_date_checker.py
    image_process.py
vision/
    __init__.py
    __pycache__/
    config.py
    input_prompt.txt
    middleware.py
    mongo.py
    routes.py
    scripts/
        ocr/
    utils.py
```

## Installation

### Conda Environment

Create and activate the conda environment:
```sh
conda create -n qualiscan python=3.10
conda activate qualiscan
```

### Install Packages

Install packages with conda:
```sh
conda install -c conda-forge fastapi uvicorn opencv numpy pillow python-dotenv
```

Install remaining packages with pip:
```sh
pip install inference-sdk langchain_google-genai
```

## Usage

### Running the Frontend

Navigate to the frontend directory:
```sh
cd frontend
```

Install dependencies:
```sh
pnpm install
```

Start the development server:
```sh
pnpm run dev
```

### Running the Backend

Run the main script:
```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Key Files and Directories

- `frontend/src/components`: Contains React components.
- `image_process.py`: Handles image processing logic.
- `ocr/ocr.py`: Contains OCR-related functions.
- `utils/expiry_date_checker.py`: Utility for checking expiry dates.
- `vision/config.py`: Configuration for vision-related tasks.

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Commit your changes:
    ```sh
    git commit -m 'Add new feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

## Prompt for Vision Transformer Model

### Task Overview

Detect and recognize FMCG products in images, with a secondary feature to detect the ripeness and freshness of bananas, apples, and oranges. Classify each fruit as "Fresh," "Ripe," "Overripe," or "Spoiled".

### Input

An image containing one or more FMCG products, which may include bananas, apples, or oranges.

### Instructions

#### General Approach

1. **Segmentation & Identification**: Identify and segment each product.
2. **Product Recognition**: Recognize and classify FMCG products.
3. **Color Analysis**: For fruits, assess overall color for freshness and ripeness.
4. **Texture Evaluation**: For fruits, analyze surface texture for blemishes or softness.
5. **Shape Detection**: For fruits, detect contour and shape for irregularities.
6. **Output Format**: Classify each product and provide a confidence score.

#### Detailed Analysis for Each Fruit

- **Bananas**:
  - Fresh: Bright yellow, minimal brown spots.
  - Ripe: Yellow with some brown spots.
  - Overripe: Predominantly brown, mushy.
  - Spoiled: Black, moldy.
- **Apples**:
  - Fresh: Vibrant color, no spots.
  - Ripe: Mostly vibrant, few blemishes.
  - Overripe: Discoloration, large patches.
  - Spoiled: Shriveling, mold.
- **Oranges**:
  - Fresh: Bright orange, uniform color.
  - Ripe: Slightly duller, minimal blemishes.
  - Overripe: Brownish spots, uneven color.
  - Spoiled: Dark patches, mold.

### Output Format

```json
[
  { "Product": "Banana", "Classification": "Fresh", "Confidence_Score": 0.95 },
  { "Product": "Apple", "Classification": "Overripe", "Confidence_Score": 0.85 },
  { "Product": "Orange", "Classification": "Ripe", "Confidence_Score": 0.92 }
]
```

### Advanced Instructions

- Focus on high-quality segmentation.
- Leverage multi-scale analysis.
- Adapt confidence thresholds dynamically.