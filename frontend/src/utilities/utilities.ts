import { SHOW_BURGER_MENU_PX } from './contants';

interface CustomRequestInit extends RequestInit {
  requestBody?: Record<string, unknown>;
}

export const myFetch = async (url: string, options?: CustomRequestInit) => {
  if (options) {
    if (options.requestBody) {
      options.body = JSON.stringify(options.requestBody);
    }
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
    throw new Error(data.message);
  }
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

export const valueFromPercentage = (full: number, percentage: number) => {
  return Math.floor((full * percentage) / 100);
};

export const datesEqualOnDay = (
  date1ToFormat: string | Date,
  date2ToFormat: string | Date
) => {
  const date1 = new Date(date1ToFormat).setHours(0, 0, 0, 0);
  const date2 = new Date(date2ToFormat).setHours(0, 0, 0, 0);
  return date1 === date2;
};

export const addDaysFromToday = (daysToAdd: number) => {
  return addDays(new Date(Date.now()), daysToAdd);
};

export const addDays = (from: Date, daysToAdd: number) => {
  const result = new Date(from);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const calculateContrast = (
  rgb1: [number, number, number],
  rgb2: [number, number, number]
) => {
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const isHexColor = (hex: string) => {
  if (hex[0] !== '#') {
    return false;
  }
  const hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
  return hexcolor.test(hex);
};

export const addOpacity = (hex: string, opacity: number) => {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return hex + _opacity.toString(16).toUpperCase();
};
