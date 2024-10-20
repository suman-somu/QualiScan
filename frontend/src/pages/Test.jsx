import { useState } from 'react';

function Test() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [output, setOutput] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [segmentedImage, setSegmentedImage] = useState(null);

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
      const response = await fetch('http://localhost:8000/process-ocr/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.Output);
        setProcessingTime(data['Processing Time (seconds)']);
        setSegmentedImage(data['Segmented Image']);
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
    setOutput(null);
    setProcessingTime(null);
    setSegmentedImage(null);
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
            className="inline-block px-4 py-2 mt-4 bg-button text-gray-600  rounded cursor-pointer hover:bg-buttonHover"
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
        {output && (
          <div className="mt-4 p-4 bg-highlight rounded-lg">
            <h2 className="text-primary">Output:</h2>
            <p className="text-secondary">{output}</p>
            <h2 className="text-primary mt-2">Processing Time (seconds):</h2>
            <p className="text-secondary">{processingTime}</p>
            {segmentedImage && (
              <div className="mt-4">
                <h2 className="text-primary">Segmented Image:</h2>
                <img src={segmentedImage} alt="Segmented" className="mt-2 rounded-lg" />
              </div>
            )}
          </div>
        )}
      </main>
    </container>
  );
}

export default Test;