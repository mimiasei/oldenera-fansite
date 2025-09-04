import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminNews from './pages/AdminNews';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import NewsCreate from './pages/NewsCreate';
import NewsEdit from './pages/NewsEdit';
import NotificationContainer from './components/NotificationContainer';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsArticle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/news" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminNews />
                </ProtectedRoute>
              } />
              <Route path="/admin/news/create" element={
                <ProtectedRoute requireModerator={true}>
                  <NewsCreate />
                </ProtectedRoute>
              } />
              <Route path="/admin/news/edit/:id" element={
                <ProtectedRoute requireModerator={true}>
                  <NewsEdit />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Coming Soon Pages */}
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
            </Routes>
          </main>
          
          <Footer />
          <NotificationContainer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;