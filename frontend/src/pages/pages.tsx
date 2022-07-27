import React, { useEffect } from 'react';
import { fetchHomework } from '../store/homework-slice';

import { useAppSelector } from '../utilities/hooks';

export const HomePage: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token) as string;

  useEffect(() => {
    fetchHomework(token);
  }, [token]);
  return <h1>Home page</h1>;
};

export const NotFound: React.FC = () => {
  return <h1>Error 404: page not found</h1>;
};
