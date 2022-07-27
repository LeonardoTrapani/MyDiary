import React, { useEffect } from 'react';
import { BACKEND_URL } from '../utilities/contants';
import { useAppSelector, useFetch } from '../utilities/hooks';

export const HomePage: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const {
    fetchNow: fetchHomework,
    data: homework,
    // error: homeworkError,
    // loading: isHomeworkLoading,
  } = useFetch();

  useEffect(() => {
    fetchHomework(BACKEND_URL + '/homework/all', {
      headers: {
        Authorization: token as string,
      },
    });
  }, [token, fetchHomework]);

  useEffect(() => {
    console.log(homework);
  }, [homework]);
  return <h1>Home page</h1>;
};

export const NotFound: React.FC = () => {
  return <h1>Error 404: page not found</h1>;
};
