import { Button, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Group justify="space-between" align="center"  p="md" bg="blue.8" c="white">
      <Text fz="xl" fw="bold" c="white">QualiScan</Text>
      <Group gap="md">
        <Link to="/">
          <Button variant="filled" color="blue.6">Dashboard</Button>
        </Link>
        <Link to="/test">
          <Button variant="filled" color="blue.6">Test</Button>
        </Link>
      </Group>
    </Group>
  );
}

export default Header;
