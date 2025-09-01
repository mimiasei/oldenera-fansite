import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fantasy-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold font-fantasy">
            Heroes of Might and Magic: Olden Era
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/news" 
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  News
                </Link>
              </li>
              <li>
                <Link 
                  to="/game-info" 
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Game Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/screenshots" 
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Screenshots
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;