import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { uiActions } from "../store/ui-slice";
import { calculateShowBurger } from "./utilities";
import { ActionMeta, SingleValue } from "react-select";
import { subjectsActions } from "../store/subjects-slice";

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
  }[],
  defaultValue?: string
) => {
  const [value, setValue] = useState(defaultValue || "");
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const manualSetValue = (value: string) => {
    setValue(value);
  };

  const reset = () => {
    setValue(defaultValue || "");
    isFirstTime.current = true;
    setErrorMessage("");
    setHasBeenTouched(false);
    setIsValid(false);
  };
  return {
    value,
    onChangeValue,
    onChangeTextAreaValue,
    errorMessage,
    hasError,
    validate,
    isValid,
    manualSetValue,
    reset,
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
  let errorMessage = "";
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

export interface CustomRequestInit extends RequestInit {
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
            "Content-Type": "application/json",
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
      if (typeof showBurger !== "undefined") {
        dispatch(uiActions.toggleBurgerMenuShown(showBurger));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, showBurgerMenu]);
};

export const useFetchAuthorized = () => {
  const token = useAppSelector((state) => state.auth.token);
  const fetchAuthorized = useCallback(
    () => async (url: string, options?: CustomRequestInit) => {
      let finalOptions: CustomRequestInit | undefined = {};
      if (options) {
        finalOptions = { ...options };
        if (options.requestBody) {
          finalOptions.body = JSON.stringify(options.requestBody);
          delete finalOptions.requestBody;
        }
        finalOptions.headers = {
          ...finalOptions.headers,
          Authorization: token as string,
          "Content-Type": "application/json",
        };
      } else {
        finalOptions = {
          headers: {
            Authorization: token as string,
            "Content-Type": "application/json",
          },
        };
      }

      const result = await fetch(url, finalOptions);
      const data = await result.json();
      if (!result.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    [token]
  );
  return fetchAuthorized;
};

export const useUpdate = (
  func: () => React.EffectCallback,
  deps: unknown[]
) => {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const cleanup = func();

    return cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
};

export const useDropdown = (
  checksToBeValid: {
    check: (value: string) => boolean;
    errorMessage: string;
  }[]
) => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFirstTime = useRef(true);
  useEffect(() => {
    if (!isFirstTime.current) {
      setHasBeenTouched(true);
      const checksValidResult = areAllChecksValid(checksToBeValid, value);
      setErrorMessage(checksValidResult.errorMessage);
      setIsValid(checksValidResult.isValid);
    } else {
      isFirstTime.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const hasError = useMemo(
    () => !isValid && hasBeenTouched,
    [isValid, hasBeenTouched]
  );

  const handleChange = (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    if (actionMeta.action === "select-option") {
      if (newValue?.value) {
        setValue(newValue.value);
      }
    }
  };

  const validate = () => {
    setHasBeenTouched(true);
    const checksValidResult = areAllChecksValid(checksToBeValid, value);
    setErrorMessage(checksValidResult.errorMessage);
    setIsValid(checksValidResult.isValid);
    return checksValidResult.isValid;
  };

  const dispatch = useAppDispatch();
  const onCreateOption = (inputValue: string) => {
    dispatch(subjectsActions.setCreatingSubject(inputValue));
  };

  return {
    value,
    handleChange,
    errorMessage,
    hasError,
    validate,
    isValid,
    onCreateOption,
  };
};
