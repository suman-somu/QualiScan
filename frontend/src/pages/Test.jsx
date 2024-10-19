import { useState } from 'react';

function Test() {
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
    <container className='h-full w-full flex p-10'>
      <main className="w-full h-fit flex flex-col justify-center items-center">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="min-w-[80%] border-2 border-dashed border-gray-300 p-8 text-center mb-4 rounded-lg"
        >
          <p className="text-gray-600">Drag & Drop an image here</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="upload-input"
          />
          <label
            htmlFor="upload-input"
            className="inline-block px-4 py-2 mt-4 bg-button text-gray-600 rounded cursor-pointer hover:bg-buttonHover"
          >
            Upload Image
          </label>
        </div>
        {selectedImage && (
          <div className="mt-4">
            <p className="text-gray-700">Selected Image: {selectedImage.name}</p>
            <div className="mt-2">
              <button
                onClick={handleDiscardImage}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2 hover:bg-red-700"
              >
                Discard
              </button>
              <button
                onClick={handleProcessImage}
                className="px-4 py-2 bg-button text-white rounded hover:bg-buttonHover"
              >
                Process
              </button>
            </div>
          </div>
        )}
      </main>
    </container>
  );
}

export default Test;