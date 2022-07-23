import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// =========== EXAMPLE ==============
// const {
//   value: emailValue,
//   onChangeValue: emailChangeHandler,
//   hasError: emailError,
//   errorMessage: emailErrorMessage,
//   validate: validateEmail,
//   isValid: isEmailValid,
// } = useInput([
//   { check: emailValidCheck, errorMessage: 'Please enter a valid email' },
// ]);
// ===================================
export const useInput = (
  checksToBeValid: { check: (value: string) => boolean; errorMessage: string }[]
) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFirstTime = useRef(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isFirstTime.current) {
        console.log('validating');
        setHasBeenTouched(true);
        const checksValidResult = areAllChecksValid(checksToBeValid, value);
        setErrorMessage(checksValidResult.errorMessage);
        setIsValid(checksValidResult.isValid);
      } else {
        isFirstTime.current = false;
      }
    }, 700);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const hasError = useMemo(
    () => !isValid && hasBeenTouched,
    [isValid, hasBeenTouched]
  );

  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const validate = () => {
    setHasBeenTouched(true);
    const checksValidResult = areAllChecksValid(checksToBeValid, value);
    setErrorMessage(checksValidResult.errorMessage);
    setIsValid(checksValidResult.isValid);
    return checksValidResult.isValid;
  };
  return {
    value,
    onChangeValue,
    errorMessage,
    hasError,
    validate,
    isValid,
  };
};

const areAllChecksValid = (
  checksToBeValid: {
    check: (value: string) => boolean;
    errorMessage: string;
  }[],
  value: string
) => {
  let isValid = true;
  let errorMessage = '';
  for (let i = 0; i < checksToBeValid.length; i++) {
    if (!checksToBeValid[i].check(value)) {
      errorMessage = checksToBeValid[i].errorMessage;
      isValid = false;
      break;
    }
  }
  return {
    isValid,
    errorMessage,
  };
};

// ========== EXAMPLE =============
// const {
//   fetchNow: sendCart,
//   data: sendCartData,
//   error: sendCartError,
//   loading: sendCartLoading,
// } = useFetch();
// =================================

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [data, setData] = useState<Record<string, never> | undefined>(
    undefined
  );

  const fetchNow = useCallback(async (url: string, options?: RequestInit) => {
    setLoading(true);
    try {
      console.log('FETCHING DATA');
      const result = await fetch(url, {
        ...options,
      });
      const data = await result.json();
      if (!result.ok) {
        setError(data.message);
      }
      setLoading(false);
      setData(data);
    } catch (err) {
      setLoading(false);
      setError('an error has occurred');
    }
  }, []);

  return { loading, error, data, fetchNow };
};
