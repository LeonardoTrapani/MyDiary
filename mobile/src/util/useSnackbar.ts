import { useEffect, useState } from "react";

const useSnackbar = (seconds: number, text: string | null) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (text) {
      setIsActive(true);
    }
    const timeout = setTimeout(() => {
      // setIsActive(false);
    }, seconds);
    return () => {
      clearTimeout(timeout);
    };
  }, [text, seconds]);

  return { isActive, text };
};

export default useSnackbar;
