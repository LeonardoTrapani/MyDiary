import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('running');
    navigate('/login', { replace: true });
  }, []);

  return <h1>Home page</h1>;
};

export const LoginPage = () => {
  return (
    <Link className='' to='/signup'>
      Signup instead
    </Link>
  );
};

export const SignupPage = () => {
  return <Link to='/login'>Login instead</Link>;
};

export const NotFound = () => {
  return <h1>Error 404: page not found</h1>;
};
