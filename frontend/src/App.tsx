import React, { useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteGuard from './components/UI/RouteGuard';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignupPage } from './pages/SignupPage/SignupPage';
import { HomePage, NotFound } from './pages/pages';
import NavBar from './components/UI/NavBar';
import { useShowBurger, useAppSelector } from './utilities/hooks';
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
const App: React.FC = () => {
  const showBurger = useAppSelector((state) => state.ui.showBurgerMenu);
  useShowBurger();
  const { pathname } = useLocation();

  const showNav = pathname === '/';

  const navigation = (
    <>
      {showBurger && <BurgerMenu />}
      {!showBurger && <NavBar />}
    </>
  );
  return (
    <>
      {showNav && navigation}
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
