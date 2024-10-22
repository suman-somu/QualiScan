import { useState, useEffect } from 'react';
import { Button, Container, Text, Group, Stack, TextInput, LoadingOverlay, Card, Accordion, ActionIcon } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { Plus, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

function Test() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([
    {
      manufacturer: '',
      productName: '',
      ingredients: '',
      manufacturingUnit: '',
      expiryDate: '',
      netWeight: '',
      barcode: '',
      otherDetails: '',
    },
  ]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading]);

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

    const expectedValues = products.map((product) => ({
      manufacturer: product.manufacturer,
      product_name: product.productName,
      ingredients: product.ingredients,
      manufacturing_unit: product.manufacturingUnit,
      expiry_date: product.expiryDate,
      net_weight: product.netWeight,
      barcode: product.barcode,
      other_details: product.otherDetails,
    }));

    formData.append('expected_values', JSON.stringify(expectedValues));

    await fetch('http://localhost:8000/process-ocr/', {
      method: 'POST',
      body: formData,
    }).catch((error) => {
      console.error('Error processing image:', error);
      alert('An error occurred while processing the image.');
    });

    handleDiscardImage();
    setLoading(false);
  };

  const handleDiscardImage = () => {
    setSelectedImage(null);
    setProducts([
      {
        manufacturer: '',
        productName: '',
        ingredients: '',
        manufacturingUnit: '',
        expiryDate: '',
        netWeight: '',
        barcode: '',
        otherDetails: '',
      },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        manufacturer: '',
        productName: '',
        ingredients: '',
        manufacturingUnit: '',
        expiryDate: '',
        netWeight: '',
        barcode: '',
        otherDetails: '',
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  return (
    <Container className='h-full w-full flex flex-col p-10'>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }}
      />
      <Stack align="center" spacing="md" className="w-full">
        <Dropzone
          onDrop={handleImageUpload}
          accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
          multiple={false}
          className="w-full border-2 border-dashed border-gray-300 p-8 text-center mb-4 rounded-lg"
        >
          <Text align="center" c="gray">Drag & Drop an image here</Text>
          <Text align="center" c="gray">or</Text>
          <Button mt="sm" color="blue" size="lg">Upload Image</Button>
        </Dropzone>
        {selectedImage && (
          <div className="w-full mt-4">
            <Text c="gray">Selected Image: {selectedImage.name}</Text>
            <Group mt="sm" position="center">
              <Button color="red" onClick={handleDiscardImage} size="lg">Discard</Button>
            </Group>
            <Accordion mt="md" className="w-full">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion.Item label={`Product ${index + 1}`}>
                    <Card shadow="sm" padding="lg" className="w-full">
                      <Stack spacing="sm">
                        <TextInput
                          label="Manufacturer"
                          value={product.manufacturer}
                          onChange={(e) => handleProductChange(index, 'manufacturer', e.target.value)}
                        />
                        <TextInput
                          label="Product Name"
                          value={product.productName}
                          onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                        />
                        <TextInput
                          label="Ingredients"
                          value={product.ingredients}
                          onChange={(e) => handleProductChange(index, 'ingredients', e.target.value)}
                        />
                        <TextInput
                          label="Manufacturing Unit"
                          value={product.manufacturingUnit}
                          onChange={(e) => handleProductChange(index, 'manufacturingUnit', e.target.value)}
                        />
                        <TextInput
                          label="Expiry Date"
                          value={product.expiryDate}
                          onChange={(e) => handleProductChange(index, 'expiryDate', e.target.value)}
                        />
                        <TextInput
                          label="Net Weight"
                          value={product.netWeight}
                          onChange={(e) => handleProductChange(index, 'netWeight', e.target.value)}
                        />
                        <TextInput
                          label="Barcode"
                          value={product.barcode}
                          onChange={(e) => handleProductChange(index, 'barcode', e.target.value)}
                        />
                        <TextInput
                          label="Other Details"
                          value={product.otherDetails}
                          onChange={(e) => handleProductChange(index, 'otherDetails', e.target.value)}
                        />
                        <Group position="right" mt="md">
                          <ActionIcon color="red" onClick={() => handleRemoveProduct(index)}>
                            <Trash size={16} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Accordion.Item>
                </motion.div>
              ))}
            </Accordion>
            <Group position="center" mt="md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button color="blue" onClick={handleAddProduct} leftIcon={<Plus size={16} />} size="lg">
                  Add Another Product
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button color="green" onClick={handleProcessImage} size="lg">
                  Process
                </Button>
              </motion.div>
            </Group>
          </div>
        )}
      </Stack>
    </Container>
  );
}

export default Test;