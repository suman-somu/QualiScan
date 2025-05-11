import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppShell, useMantineTheme } from '@mantine/core';
import Test from './pages/Test';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  const theme = useMantineTheme();

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        padding="md"
        styles={{
          main: {
            background: theme.white,
            color: theme.colors.gray[9]
          }
        }}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;
