import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Lenis from 'lenis';
import Sidebar from './components/Sidebar';
import ParallaxBackground from './components/ParallaxBackground';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AuthForm from './components/AuthForm';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen">
        <ParallaxBackground />

        {user && <Sidebar />}

        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/transactions"
              element={user ? <Transactions /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={user ? <Analytics /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? (
                <div className="min-h-screen flex items-center justify-center p-4">
                  <AuthForm type="login" />
                </div>
              ) : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? (
                <div className="min-h-screen flex items-center justify-center p-4">
                  <AuthForm type="register" />
                </div>
              ) : <Navigate to="/" />}
            />
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
