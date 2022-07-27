import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { uiActions } from '../store/ui-slice';
import { calculateShowBurger } from './utilities';

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
  checksToBeValid: {
    check: (value: string) => boolean;
    errorMessage: string;
  }[]
) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFirstTime = useRef(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isFirstTime.current) {
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
  const onChangeTextAreaValue = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    onChangeTextAreaValue,
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

interface CustomRequestInit extends RequestInit {
  requestBody?: Record<string, unknown>;
}

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [data, setData] = useState<Record<string, never> | undefined>(
    undefined
  );

  const fetchNow = useCallback(
    async (url: string, options?: CustomRequestInit) => {
      setLoading(true);
      try {
        if (options) {
          options.body = JSON.stringify(options.requestBody);
          options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
          };
        }
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
        const error = err as Error;
        setLoading(false);
        setError(error.message);
      }
    },
    []
  );

  return { loading, error, data, fetchNow };
};

export const useShowBurger = () => {
  const dispatch = useAppDispatch();
  const showBurgerMenu = useAppSelector((state) => state.ui.showBurgerMenu);
  useEffect(() => {
    const handleResize = () => {
      const showBurger = calculateShowBurger(window.innerWidth, showBurgerMenu);
      if (typeof showBurger !== 'undefined') {
        dispatch(uiActions.toggleBurgerMenuShown(showBurger));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, showBurgerMenu]);
};
