import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import Factions from './pages/Factions';
import FactionDetail from './pages/FactionDetail';
import Screenshots from './pages/Screenshots';
import AdminMedia from './pages/AdminMedia';
import AdminMediaEdit from './pages/AdminMediaEdit';
import AdminGameAssets from './pages/admin/AdminGameAssets';
import Forum from './pages/Forum';
import NotificationContainer from './components/NotificationContainer';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <ThemeProvider>
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
              <Route path="/admin/media" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminMedia />
                </ProtectedRoute>
              } />
              <Route path="/admin/media/:id/edit" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminMediaEdit />
                </ProtectedRoute>
              } />
              <Route path="/admin/game-assets" element={
                <ProtectedRoute requireModerator={true}>
                  <AdminGameAssets />
                </ProtectedRoute>
              } />
              
              {/* Game Information Routes */}
              <Route path="/factions" element={<Factions />} />
              <Route path="/factions/:id" element={<FactionDetail />} />
              <Route path="/game-info" element={<Factions />} />
              <Route path="/screenshots" element={<Screenshots />} />
              <Route path="/forum" element={<Forum />} />
            </Routes>
          </main>
          
          <Footer />
          <NotificationContainer />
          </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
      
      <Analytics />
    </div>
  );
}

export default App;