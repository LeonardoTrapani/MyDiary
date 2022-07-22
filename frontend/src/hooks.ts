import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const hook = () => {};
// import { useState } from 'react';

// export const useInput = (checkToBeValid: (value: string) => boolean) => {
//   const [state, setState] = useState({
//     value: '',
//     isValid: false,
//     hasBeenTouched: false,
//   });

//   const hasError = !state.isValid && state.hasBeenTouched;
//   const onChangeValue = (event: ) => {
//     let onEventValid = false;
//     if (checkToBeValid(event.target.value)) {
//       onEventValid = true;
//     }
//     setState({
//       value: event.target.value,
//       hasBeenTouched: true,
//       isValid: onEventValid,
//     });
//   };
//   const onBlur = () => {
//     setState((prevState) => {
//       const isValid = checkToBeValid(prevState.value);
//       return {
//         ...prevState,
//         isValid,
//         hasBeenTouched: true,
//       };
//     });
//   };
//   return [state.value, hasError, onChangeValue, onBlur];
// };

// export default useInput;

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
