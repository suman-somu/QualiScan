import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Accordion, Box, Group, ScrollArea, Text, Pagination, Badge } from '@mantine/core';
import axios from 'axios';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8000/orders/?page=${page}&limit=10`);
        setData(response.data.orders || []);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      } catch (error) {
        console.error('Error fetching orders:', error);
        setData([]);
      }
    }
    fetchData();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const items = (data || []).map((order) => (
    <Accordion.Item key={order._id || order.order_id} value={order._id || order.order_id}>
      <Accordion.Control>
        <div className='flex px-5'>
          <Text className="truncate"> Order: {order.order_id || 'N/A'}</Text>
          <Badge color={order.matched ? 'green' : 'red'} style={{ marginLeft: 'auto' }}>
            {order.matched ? 'Matched' : 'Unmatched'}
          </Badge>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <Group grow>
          <Box className="w-full h-80 overflow-auto">
            <Text c="primary" weight={500}>
              Expected Products:
            </Text>
            <ScrollArea style={{ width: '100%', height: 200 }}>
              {(order.expected_values || []).map((product, index) => (
                <pre key={`expected-${index}`} className="whitespace-pre-wrap break-words">{JSON.stringify(product, (key, value) => value, 2)}</pre>
              ))}
            </ScrollArea>
          </Box>
          <Box className="w-full h-80 overflow-auto">
            <Text c="primary" weight={500}>
              Actual Products:
            </Text>
            <ScrollArea style={{ width: '100%', height: 200 }}>
              {(order.actual_values || []).map((product, index) => (
                <pre key={`actual-${index}`} className="whitespace-pre-wrap break-words">{JSON.stringify(product, (key, value) => value, 2)}</pre>
              ))}
            </ScrollArea>
          </Box>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <div className="w-full min-h-full h-fit border border-border bg-surface rounded-lg p-2 overflow-auto flex flex-col gap-4 items-center justify-between overflow-y-hidden">
      <Accordion defaultValue="O001" className="w-full grow">
        {items}
      </Accordion>
      <Pagination total={totalPages} value={page} onChange={handlePageChange} size="lg" />
    </div>
  );
};

export default Dashboard;
