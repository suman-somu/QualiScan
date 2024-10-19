import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Test from './pages/Test';

function App() {
  return (
    <Router>
      <div className='w-screen h-screen flex flex-col bg-background text-text'>
        <Header />
        <div className='flex grow h-full w-full'>
          <Sidebar />
          <main className='w-full h-full'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}

export default App;