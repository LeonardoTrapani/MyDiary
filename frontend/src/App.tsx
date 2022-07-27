import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import RouteGuard from './components/UI/RouteGuard';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignupPage } from './pages/SignupPage/SignupPage';
import { HomePage, NotFound } from './pages/pages';
import NavBar from './components/UI/NavBar';
import {
  useShowBurger,
  useAppSelector,
  useInitialAuthentication,
} from './utilities/hooks';
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
import LoadingSpinner from './components/UI/LoadingSpinner';
import AuthenticatedRouteGuard from './components/UI/AuthenticatedRouteGuard';

const App: React.FC = () => {
  const showBurger = useAppSelector((state) => state.ui.showBurgerMenu);
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  useShowBurger();
  useInitialAuthentication();

  const { pathname } = useLocation();

  const hideNav = pathname === '/login' || pathname === '/signup';

  const navigation = (
    <>
      {showBurger && <BurgerMenu />}
      {!showBurger && <NavBar />}
    </>
  );

  if (isLoading) {
    return <LoadingSpinner center />;
  }
  return (
    <>
      {!hideNav && navigation}
      <Routes>
        <Route
          path='/'
          element={
            <RouteGuard>
              <HomePage />
            </RouteGuard>
          }
        />
        <Route
          path='/login'
          element={
            <AuthenticatedRouteGuard>
              <LoginPage />
            </AuthenticatedRouteGuard>
          }
        />
        <Route
          path='/signup'
          element={
            <AuthenticatedRouteGuard>
              <SignupPage />
            </AuthenticatedRouteGuard>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
