import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";

import { RootStackScreenProps } from "../../types";
import { login } from "../api/auth";
import AuthForm, { AuthInputType } from "../components/AuthForm";
import LoginSvg from "../components/svgs/LoginSvg";

import useInput, { emailValidCheck } from "../util/useInput";

export const LoginScreen = ({ navigation }: RootStackScreenProps<"Login">) => {
  const queryClient = useQueryClient();
  const loginMutation = useMutation(
    (loginInfo: { email: string; password: string }) => {
      return login(loginInfo.email, loginInfo.password);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["validToken"]);
      },
      onError: () => {
        setLoginHasLoaded(false);
      },
    }
  );
  const [loginHasLoaded, setLoginHasLoaded] = useState(false);

  useEffect(() => {
    if (loginMutation.isLoading) {
      setLoginHasLoaded(true);
    }
  }, [loginMutation.isLoading]);

  const {
    errorMessage: emailErrorMessage,
    hasError: emailHasError,
    isValid: emailIsValid,
    onChangeText: emailOnChangeText,
    validate: emailValidate,
    value: emailValue,
  } = useInput([
    { check: (value) => !!value, errorMessage: "please enter an email" },
    {
      check: emailValidCheck,
      errorMessage: "please enter a valid email",
    },
  ]);

  const {
    errorMessage: passwordErrorMessage,
    hasError: passwordHasError,
    isValid: passwordIsValid,
    onChangeText: passwordOnChangeText,
    validate: passwordValidate,
    value: passwordValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: "please enter a password",
    },
  ]);
  // } = useInput(passwordInputChecks);

  const isFormValid = passwordIsValid && emailIsValid;
  const submitLoginHandler = async () => {
    if (isFormValid) {
      loginMutation.mutate({
        email: emailValue,
        password: passwordValue,
      });
    } else {
      emailValidate();
      passwordValidate();
    }
  };
  const signupInsteadHandler = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.push("Signup");
    }
  };
  const inputs: AuthInputType[] = [
    {
      name: "email",
      errorMessage: emailErrorMessage,
      hasError: emailHasError,
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoComplete: "email",
      onChangeText: emailOnChangeText,
      validate: emailValidate,
      value: emailValue,
      secureTextEntry: false,
    },
    {
      name: "password",
      errorMessage: passwordErrorMessage,
      hasError: passwordHasError,
      autoCapitalize: "none",
      autoComplete: "password",
      keyboardType: "default",
      onChangeText: passwordOnChangeText,
      secureTextEntry: true,
      validate: passwordValidate,
      value: passwordValue,
    },
  ];

  return (
    <AuthForm
      insteadHandler={signupInsteadHandler}
      insteadTitle="signup instead"
      title="Login"
      inputs={inputs}
      submitHandler={submitLoginHandler}
      svg={<LoginSvg />}
      isLoading={loginHasLoaded}
      hasError={loginMutation.isError}
      error={loginMutation.error as AxiosError}
    />
  );
};
