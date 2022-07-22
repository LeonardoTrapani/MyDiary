import { Route, Routes } from 'react-router-dom';
import RouteGuard from './components/RouteGuard';
import { HomePage, LoginPage, SignupPage, NotFound } from './pages';
function App() {
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
}

export default App;