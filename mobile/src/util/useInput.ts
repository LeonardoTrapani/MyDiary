import { useEffect, useMemo, useRef, useState } from "react";

const useInput = (
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

  const hasError = useMemo(
    () => !isValid && hasBeenTouched,
    [isValid, hasBeenTouched]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isFirstTime.current && hasError) {
        setHasBeenTouched(true);
        const checksValidResult = areAllChecksValid(checksToBeValid, value);
        setErrorMessage(checksValidResult.errorMessage);
        setIsValid(checksValidResult.isValid);
      } else {
        isFirstTime.current = false;
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const onChangeText = (text: string) => {
    setValue(text);
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
    onChangeText,
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

export default useInput;

export const passwordInputChecks = [
  {
    check: (value: string) => {
      return value.length > 0;
    },
    errorMessage: "please enter a password",
  },

  {
    check: (value: string) => {
      const format = /\W/;
      if (format.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    errorMessage: "at least one special character",
  },
  {
    check: (value: string) => {
      return /[A-Z]/.test(value);
    },
    errorMessage: "at least uppercase letter",
  },
  {
    check: (value: string) => {
      const regexp = /\d/;
      return regexp.test(value);
    },
    errorMessage: "at least one number",
  },
  {
    check: (value: string) => {
      const regexp = /[a-z]/;
      return regexp.test(value);
    },
    errorMessage: "at least one lowercase letter",
  },
  {
    check: (value: string) => {
      return value.length >= 8;
    },
    errorMessage: "at least 8 characters",
  },
];

export const emailValidCheck = (email: string) => {
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  if (validateEmail(email)) {
    return true;
  }
  return false;
};
