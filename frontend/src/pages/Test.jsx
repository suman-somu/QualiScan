import { useState } from 'react';
import { Button, Container, Text, Group, Stack, TextInput, LoadingOverlay } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

function Test() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [productName, setProductName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [manufacturingUnit, setManufacturingUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [barcode, setBarcode] = useState('');
  const [otherDetails, setOtherDetails] = useState('');

  const handleImageUpload = (files) => {
    const file = files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleProcessImage = async () => {
    setLoading(true);
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    const expectedValues = [
      {
        manufacturer,
        product_name: productName,
        ingredients,
        manufacturing_unit: manufacturingUnit,
        expiry_date: expiryDate,
        net_weight: netWeight,
        barcode,
        other_details: otherDetails,
      }
    ];

    formData.append('expected_values', JSON.stringify(expectedValues));

    // Send the request asynchronously and clear inputs immediately
    await fetch('http://localhost:8000/process-ocr/', {
      method: 'POST',
      body: formData,
    }).catch((error) => {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image.');
    });

    // Clear inputs after sending the request
    handleDiscardImage();
    setLoading(false);
  };

  const handleDiscardImage = () => {
    setSelectedImage(null);
    setManufacturer('');
    setProductName('');
    setIngredients('');
    setManufacturingUnit('');
    setExpiryDate('');
    setNetWeight('');
    setBarcode('');
    setOtherDetails('');
  };

  return (
    <Container className='h-full w-full flex flex-col p-10'>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Stack align="center" spacing="md" className="w-full">
        <Dropzone
          onDrop={handleImageUpload}
          accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
          multiple={false}
          className="w-full border-2 border-dashed border-gray-300 p-8 text-center mb-4 rounded-lg"
        >
          <Text align="center" c="gray">Drag & Drop an image here</Text>
          <Text align="center" c="gray">or</Text>
          <Button mt="sm" color="blue">Upload Image</Button>
        </Dropzone>
        {selectedImage && (
          <div className="w-full mt-4">
            <Text c="gray">Selected Image: {selectedImage.name}</Text>
            <Group mt="sm">
              <Button color="red" onClick={handleDiscardImage}>Discard</Button>
              <Button color="blue" onClick={handleProcessImage}>Process</Button>
            </Group>
            <Stack mt="md" spacing="sm" className="w-full">
              <TextInput label="Manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
              <TextInput label="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
              <TextInput label="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
              <TextInput label="Manufacturing Unit" value={manufacturingUnit} onChange={(e) => setManufacturingUnit(e.target.value)} />
              <TextInput label="Expiry Date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              <TextInput label="Net Weight" value={netWeight} onChange={(e) => setNetWeight(e.target.value)} />
              <TextInput label="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              <TextInput label="Other Details" value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} />
            </Stack>
          </div>
        )}
      </Stack>
    </Container>
  );
}

export default Test;