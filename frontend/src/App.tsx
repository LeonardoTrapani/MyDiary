import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RouteGuard from './components/UI/RouteGuard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage, NotFound } from './pages/pages';
import NavBar from './components/UI/NavBar';
import { useShowBurger } from './hooks';

const App: React.FC = () => {
  useShowBurger();
  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path='/'
          element={
            <RouteGuard>
              <HomePage />
            </RouteGuard>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
