import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import React, { useEffect, useState, useRef, useCallback } from 'react';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useInput = (
  checkToBeValidNotCallback: (value: string) => boolean
) => {
  const [value, setValue] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkToBeValid = useCallback(checkToBeValidNotCallback, [value]);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const isFirstTime = useRef(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isFirstTime.current) {
        setHasBeenTouched(true);
        setIsValid(checkToBeValid(value));
      } else {
        isFirstTime.current = false;
      }
    }, 700);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, checkToBeValid]);

  const hasError = !isValid && hasBeenTouched;
  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const onBlur = () => {
    setHasBeenTouched(true);
    setIsValid(checkToBeValid(value));
  };
  return { value, hasError, onChangeValue, onBlur };
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
