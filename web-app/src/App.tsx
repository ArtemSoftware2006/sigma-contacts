import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute'
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/Main/Main';
import GraphPage from './pages/Main/Main';
import ProfilePage from './pages/Profile/ProfilePage';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/graph2" element={<GraphPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/graph2" element={<GraphPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;