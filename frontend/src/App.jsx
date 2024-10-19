import { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('YOUR_API_URL_HERE', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image processed successfully!');
      } else {
        alert('Failed to process image.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDiscardImage = () => {
    setSelectedImage(null);
  };

  return (
    <main>
      <h1>Qualiscan</h1>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        <p>Drag & Drop an image here</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="upload-input"
        />
        <label htmlFor="upload-input" className="upload-button">
          Upload Image
        </label>
      </div>
      {selectedImage && (
        <div>
          <p>Selected Image: {selectedImage.name}</p>
          <button onClick={handleDiscardImage} className="discard-button">
            Discard
          </button>
          <button onClick={handleProcessImage}>Process</button>
        </div>
      )}
    </main>
  );
}

export default App;