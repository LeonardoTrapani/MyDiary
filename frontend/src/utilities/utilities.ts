import { SHOW_BURGER_MENU_PX } from './contants';

interface CustomRequestInit extends RequestInit {
  requestBody: Record<string, unknown>;
}

export const myFetch = async (url: string, options?: CustomRequestInit) => {
  if (options) {
    options.body = JSON.stringify(options.requestBody);
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
  }
  console.log('GOING TO FETCH');
  const result = await fetch(url, {
    ...options,
  });
  const data = await result.json();
  if (!result.ok) {
    throw new Error(data.message);
  }
  console.log(data);
  return data;
};

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

export const passwordInputChecks = [
  {
    check: (value: string) => {
      return value.length > 0;
    },
    errorMessage: 'Please provide a password',
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
    errorMessage: 'Insert one special character',
  },
  {
    check: (value: string) => {
      return /[A-Z]/.test(value);
    },
    errorMessage: 'Insert one uppercase letter',
  },
  {
    check: (value: string) => {
      const regexp = /\d/;
      return regexp.test(value);
    },
    errorMessage: 'Insert at least one number',
  },
  {
    check: (value: string) => {
      const regexp = /[a-z]/;
      return regexp.test(value);
    },
    errorMessage: 'Insert one lowercase letter',
  },
  {
    check: (value: string) => {
      return value.length >= 8;
    },
    errorMessage: 'Insert at least 8 characters',
  },
];

export const calculateShowBurger = (width: number, previousShow: boolean) => {
  if (width > SHOW_BURGER_MENU_PX && previousShow === true) {
    return false;
  } else if (width <= SHOW_BURGER_MENU_PX && previousShow === false) {
    return true;
  }
};
