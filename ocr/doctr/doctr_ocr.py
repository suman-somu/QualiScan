# -*- coding: utf-8 -*-
"""doctr ocr.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1RB3QuWuSx0T4Ieyi_LqwCJpFyU2fFyTf
"""

# TensorFlow
# !pip install python-doctr[tf]
# PyTorch
!pip install python-doctr[torch]
!pip install mplcursors
# Restart runtime
exit()

# Install some free fonts for result rendering
!sudo apt-get install fonts-freefont-ttf -y

# Commented out IPython magic to ensure Python compatibility.
# %matplotlib inline
import os

# Let's pick the desired backend
# os.environ['USE_TF'] = '1'
os.environ['USE_TORCH'] = '1'

import matplotlib.pyplot as plt

from doctr.io import DocumentFile
from doctr.models import ocr_predictor

# Commented out IPython magic to ensure Python compatibility.
# %matplotlib inline
import os
import time
import matplotlib.pyplot as plt

# Let's pick the desired backend
# os.environ['USE_TF'] = '1'
os.environ['USE_TORCH'] = '1'

from doctr.io import DocumentFile
from doctr.models import ocr_predictor

# Install some free fonts for result rendering
!sudo apt-get install fonts-freefont-ttf -y

from google.colab import files
uploaded = files.upload()

for fn in uploaded.keys():
  image_path = fn

  # Read the image
  doc = DocumentFile.from_images(image_path)
  # print(f"Number of pages: {len(doc)}")

  # Instantiate a pretrained model
  predictor = ocr_predictor(pretrained=True)

  # Start timing
  start_time = time.time()

  # Perform OCR
  result = predictor(doc)

  # Calculate processing time
  end_time = time.time()
  processing_time = end_time - start_time

  # Display the architecture
  # print(predictor)

  # Visualize the results
  result.show()

  # Synthesize the page
  synthetic_pages = result.synthesize()
  plt.imshow(synthetic_pages[0]); plt.axis('off'); plt.show()

  # Print processing time
  print(f"Processing time: {processing_time:.2f} seconds")

  # Export the results
  json_export = result.export()
  print(json_export)

  # Delete the image file
  os.remove(image_path)

  # Add a line break for better visual separation between iterations
  print("\n--------------------\n")