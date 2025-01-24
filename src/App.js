import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import AboutPage from './pages/AboutPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import JobDetail from './components/JobDetail';
import PrivateRoute from './components/PrivateRoute.jsx';
import Header from './components/Header.jsx';
const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <JobDetail/>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          <Route element={<PrivateRoute />}>
         
            <Route path="/jobs" element={<JobPage />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
       
        <Footer />
      </Router>
    </AuthProvider>
  );
}


export default App;