import { Route, Routes } from 'react-router-dom';
import { HomePage, LoginPage, SignupPage, NotFound } from './pages';
function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
