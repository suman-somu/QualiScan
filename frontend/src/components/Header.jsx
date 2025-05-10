import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full h-auto p-4 pr-8 bg-primary text-accent flex justify-between items-center shadow-md transition-colors duration-300">
      <div className="text-2xl font-bold transition-transform duration-300 hover:scale-105">QualiScan</div>
      <div className="flex gap-4">
        <Link to="/" className="transition-transform duration-300 hover:scale-105">
          <button className="bg-secondary text-accent py-2 px-4 rounded shadow-md transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:bg-secondaryLight">Home</button>
        </Link>
        <Link to="/test" className="transition-transform duration-300 hover:scale-105">
          <button className="bg-secondary text-accent py-2 px-4 rounded shadow-md transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:bg-secondaryLight">Test</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
