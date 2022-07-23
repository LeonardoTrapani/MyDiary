import { Link } from 'react-router-dom';
import React from 'react';

export const HomePage: React.FC = () => {
  return <h1>Home page</h1>;
};

export const SignupPage: React.FC = () => {
  return <Link to='/login'>Login instead</Link>;
};

export const NotFound: React.FC = () => {
  return <h1>Error 404: page not found</h1>;
};
