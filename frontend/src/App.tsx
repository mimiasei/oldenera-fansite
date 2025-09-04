import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import AdminNews from './pages/AdminNews';
import NewsCreate from './pages/NewsCreate';
import NewsEdit from './pages/NewsEdit';
import NotificationContainer from './components/NotificationContainer';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/game-info" element={
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-4xl font-bold mb-6 font-fantasy">Factions</h1>
                <p className="text-lg text-gray-600">Factions page coming soon...</p>
              </div>
            } />
            <Route path="/screenshots" element={
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-4xl font-bold mb-6 font-fantasy">Screenshots</h1>
                <p className="text-lg text-gray-600">Screenshots gallery coming soon...</p>
              </div>
            } />
              <Route path="/forum" element={
                  <div className="container mx-auto px-4 py-8 text-center">
                      <h1 className="text-4xl font-bold mb-6 font-fantasy">Forum</h1>
                      <p className="text-lg text-gray-600">Forum coming soon...</p>
                  </div>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/news/create" element={<NewsCreate />} />
              <Route path="/admin/news/edit/:id" element={<NewsEdit />} />
          </Routes>
        </main>
        
        <Footer />
        <NotificationContainer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;