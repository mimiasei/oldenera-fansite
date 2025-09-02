import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fantasy-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="font-bold font-fantasy">
              <div className="text-3xl">Olden Wiki</div>
              <div className="text-xs ml-4">A Heroes of Might and Magic: Olden Era Fan Site</div>
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
                  Factions
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
              <li>
                <Link
                  to="/forum"
                  className="hover:text-primary-200 transition-colors duration-200"
                >
                  Forum
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