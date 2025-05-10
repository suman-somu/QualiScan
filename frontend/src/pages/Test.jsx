import { useState, useEffect } from 'react';
import { Button, Container, Text, Group, Stack, TextInput, LoadingOverlay, Card, Accordion, ActionIcon, Image, SimpleGrid, Paper } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import defaultExamples from '/src/constants/default_values.json';
import ImageCard from '/src/components/ImageCard';

const Test = () => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([
    {
      manufacturer: '',
      productName: '',
      ingredients: '',
      manufacturingDate: '',
      expiryDate: '',
      netWeight: '',
      barcode: '',
      otherDetails: '',
    },
  ]);
  const [defaultExampleImages, setDefaultExampleImages] = useState([]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading]);

  useEffect(() => {
    // Load default example images
    const loadDefaultExamples = async () => {
      try {
        const examples = await Promise.all(
          defaultExamples.map(async (example) => {
            const response = await fetch(`/src/assets/default_examples/${example.image}`);
            const blob = await response.blob();
            return {
              ...example,
              file: new File([blob], example.image, { type: blob.type }),
              url: URL.createObjectURL(blob)
            };
          })
        );
        setDefaultExampleImages(examples);
      } catch (error) {
        console.error('Error loading default examples:', error);
      }
    };

    loadDefaultExamples();
  }, []);

  const handleImageUpload = (files) => {
    const file = files[0];
    if (file) {
      setSelectedImageFile(file);
      setSelectedImageURL(URL.createObjectURL(file));
    }
  };

  const handleProcessImage = async () => {
    setLoading(true);
    if (!selectedImageFile) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImageFile);

    const expectedValues = products.map((product) => ({
      manufacturer: product.manufacturer,
      product_name: product.productName,
      ingredients: product.ingredients,
      manufacturing_date: product.manufacturingDate,
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
    setSelectedImageFile(null);
    setSelectedImageURL(null);
    setProducts([
      {
        manufacturer: '',
        productName: '',
        ingredients: '',
        manufacturingDate: '',
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

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleDefaultExampleSelect = (example) => {
    setSelectedImageFile(example.file);
    setSelectedImageURL(example.url);
    setProducts([{
      manufacturer: example.values.manufacturer,
      productName: example.values.productName,
      ingredients: example.values.ingredients,
      manufacturingDate: example.values.manufacturingDate,
      expiryDate: example.values.expiryDate,
      netWeight: example.values.netWeight,
      barcode: example.values.barcode,
      otherDetails: example.values.otherDetails,
    }]);
  };

  return (
    <Container p="md" h="100%" w="100%" display="flex" style={{ flexDirection: 'column' }}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        h="100vh"
      />
      <Group gap="lg" w="100%" style={{ flex: 1 }}>
        <Paper p="md" withBorder w="33%">
          <Stack gap="md">
            <Text size="lg" fw={500}>Default Examples</Text>
            <SimpleGrid cols={2} spacing="md">
              {defaultExampleImages.map((example, index) => (
                <ImageCard
                  key={index}
                  example={example}
                  onClick={() => handleDefaultExampleSelect(example)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Paper>
        <Paper p="md" radius="md" shadow="sm" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack align="center" spacing="md" w="100%" style={{ flexGrow: 1 }}>
            <Dropzone
              onDrop={handleImageUpload}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              multiple={false}
              className="w-full border-2 border-dashed border-gray-300 p-8 text-center mb-4 rounded-lg hover:border-blue-500 transition-colors"
            >
              <Text align="center" c="textSecondary">Drag & Drop an image here</Text>
              <Text align="center" c="textSecondary">or</Text>
              <Button mt="sm" className="bg-blue-600 hover:bg-blue-700" size="md">Upload Image</Button>
            </Dropzone>
            {selectedImageURL && (
              <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
                <Text c="gray">Selected Image: {selectedImageFile.name}</Text>
                <Image src={selectedImageURL} alt="Selected" className="mt-4" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                <Group mt="sm" position="center">
                  <Button color="red" onClick={handleDiscardImage} size="md">Discard</Button>
                </Group>
                <Accordion mt="md" className="w-full">
                  {products.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Accordion.Item label={`Product ${index + 1}`} className="mb-2">
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
                              label="Manufacturing Date"
                              value={product.manufacturingDate}
                              onChange={(e) => handleProductChange(index, 'manufacturingDate', e.target.value)}
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
                              <ActionIcon className="text-red-500 hover:text-red-700 p-2" onClick={() => handleRemoveProduct(index)}>
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
                    <Button className='rounded-lg bg-blue-600 hover:bg-blue-700' onClick={handleProcessImage} size="md">
                      Process
                    </Button>
                  </motion.div>
                </Group>
              </div>
            )}
          </Stack>
        </Paper>
      </Group>
    </Container>
  );
}

export default Test;
