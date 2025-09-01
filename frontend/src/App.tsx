import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import News from './pages/News';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/game-info" element={
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-4xl font-bold mb-6 font-fantasy">Game Information</h1>
                <p className="text-lg text-gray-600">Game information page coming soon...</p>
              </div>
            } />
            <Route path="/screenshots" element={
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-4xl font-bold mb-6 font-fantasy">Screenshots</h1>
                <p className="text-lg text-gray-600">Screenshots gallery coming soon...</p>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;