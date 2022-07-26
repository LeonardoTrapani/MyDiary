import React from 'react';
import SignupForm from './SignupForm';
import { useFetch } from '../../utilities/hooks';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../utilities/contants';
import Card from '../../components/UI/Card';
export const SignupPage: React.FC = () => {
  const {
    data: signupData,
    error: signupError,
    fetchNow: fetchSignup,
    loading: isSignupLoading,
  } = useFetch();

  const signupFormSubmitHandler = async (
    username: string,
    email: string,
    password: string
  ) => {
    fetchSignup(BACKEND_URL + '/signup', {
      requestBody: {
        username,
        email,
        password,
      },
      method: 'POST',
    });
  };

  return (
    <Card>
      <SignupForm
        onSubmit={signupFormSubmitHandler}
        isLoading={isSignupLoading}
      />
      <Link to='/login'>Login instead</Link>
      {signupError && <p className=''>{signupError}</p>}
      {!signupError && signupData && <p>Signed up succesfully</p>}
    </Card>
  );
};
