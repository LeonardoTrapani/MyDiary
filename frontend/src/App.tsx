import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import RouteGuard from './components/UI/RouteGuard';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignupPage } from './pages/SignupPage/SignupPage';
import { NotFound } from './pages/pages';
import {
  HomePage,
  AddHomeworkPage,
  EditHomeworkPage,
  AddedHomeworkWrapper,
} from './pages/Homework';

import { useAppSelector } from './utilities/hooks';

import LoadingSpinner from './components/UI/LoadingSpinner';
import AuthenticatedRouteGuard from './components/UI/AuthenticatedRouteGuard';

const App: React.FC = () => {
  // const showBurger = useAppSelector((state) => state.ui.showBurgerMenu);
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  // useShowBurger();

  // const { pathname } = useLocation();

  // const hideNav = pathname === '/login' || pathname === '/signup';

  // const navigation = (
  //   <>
  //     {showBurger && <BurgerMenu />}
  //     {!showBurger && <NavBar />}
  //   </>
  // );

  if (isLoading) {
    return <LoadingSpinner center />;
  }
  return (
    <>
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
        <Route
          path='/create-homework'
          element={
            <>
              <RouteGuard>
                <Outlet />
              </RouteGuard>
            </>
          }
        >
          <Route path='free-days' element={<Outlet />}>
            <Route path=':page' element={<AddedHomeworkWrapper />} />
            <Route
              index
              element={<Navigate to='/create-homework/free-days/1' />}
            />
          </Route>
          <Route index element={<AddHomeworkPage />} />
        </Route>
        <Route
          path='/edit-homework/:homeworkId'
          element={
            <RouteGuard>
              <EditHomeworkPage />
            </RouteGuard>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
