import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="w-screen h-screen flex flex-col bg-background text-text">
        <Header />
        <div className="flex grow h-full w-full">
          <main className="grow w-full h-full overflow-auto p-4">
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

export default App;