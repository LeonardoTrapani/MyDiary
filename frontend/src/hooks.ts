import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import React, { useEffect, useState, useRef, useMemo } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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

// // ------- EXAMPLE ----------
// // const {
// //   fetchNow: sendCart,
// //   data: sendCartData,
// //   error: sendCartError,
// //   loading: sendCartLoading,
// // } = useFetch();

// export const useFetch = () => {
//   const [status, setStatus] = useState({
//     loading: false,
//     error: false,
//     data: undefined,
//   });
//   const fetchNow = useCallback(async (url, options) => {
//     if (options) {
//       options.body = JSON.stringify(options.body);
//     }

//     setStatus({ loading: true, error: false, data: undefined });

//     try {
//       console.log('FETCHING DATA');
//       const result = await fetch(url, {
//         ...options,
//       });
//       if (!result.ok) {
//         return setStatus((previousStatus) => {
//           return {
//             ...previousStatus,
//             error: new Error('Unable to fetch'),
//           };
//         });
//       }
//       const data = await result.json();
//       setStatus({
//         loading: false,
//         error: false,
//         data: data,
//       });
//     } catch (err) {
//       setStatus({
//         loading: false,
//         error: err,
//         data: null,
//       });
//     }
//   }, []);

//   return { ...status, fetchNow };
// };
