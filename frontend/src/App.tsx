import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RouteGuard from './components/RouteGuard';
import { LoginPage } from './pages/Login';
import { HomePage, SignupPage, NotFound } from './pages/pages';
const App: React.FC = () => {
  return (
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
  );
};

export default App;
