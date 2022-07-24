import React from 'react';
import SignupForm from '../components/SignupForm';
import { useFetch } from '../hooks';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../contants';
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
    <div className='w-screen flex items-center justify-center flex-col gap-10'>
      <SignupForm
        onSubmit={signupFormSubmitHandler}
        isLoading={isSignupLoading}
      />
      <Link to='/login'>Login instead</Link>
      {signupError && (
        <p className='text-black border-8 border-red-700 bg-red-500 p-4 rounded'>
          {signupError}
        </p>
      )}
      {!signupError && signupData && <p>Signed up succesfully</p>}
    </div>
  );
};
