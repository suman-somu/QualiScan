import { useState, useEffect } from 'react';
import { Accordion, Box, Group, ScrollArea, Text, Pagination } from '@mantine/core';
import { Check, X } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const [activePage, setPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/orders/');
        setData(response.data.orders || []); // Ensure data is always an array
      } catch (error) {
        console.error('Error fetching orders:', error);
        setData([]); // Set data to an empty array on error
      }
    }
    fetchData();
  }, []);

  const items = (data || []).slice((activePage - 1) * 10, activePage * 10).map((order) => (
    <Accordion.Item key={order.orderid} value={order.orderid}>
      <Accordion.Control icon={order.matched ? <Check color="green" /> : <X color="red" />}>
        <Text className="truncate">{order.orderid}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Group grow>
          <Box className="w-full h-80 overflow-auto">
            <Text c="primary" weight={500}>
              Expected Products:
            </Text>
            <ScrollArea style={{ width: '100%', height: 200 }}>
              {order.expected_values.map((product, index) => (
                <pre key={index} className="whitespace-pre-wrap break-words">{JSON.stringify(product, null, 2)}</pre>
              ))}
            </ScrollArea>
          </Box>
          <Box className="w-full h-80 overflow-auto">
            <Text c="primary" weight={500}>
              Actual Products:
            </Text>
            <ScrollArea style={{ width: '100%', height: 200 }}>
              {order.actual_values.map((product, index) => (
                <pre key={index} className="whitespace-pre-wrap break-words">{JSON.stringify(product, null, 2)}</pre>
              ))}
            </ScrollArea>
          </Box>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="w-full h-screen border border-gray-300 rounded-lg p-4 overflow-auto">
      <Accordion defaultValue="O001" className="w-full">
        {items}
      </Accordion>
      <Pagination total={Math.ceil(data.length / 10)} value={activePage} onChange={setPage} className="mt-4" />
    </div>
  );
}

export default Dashboard;