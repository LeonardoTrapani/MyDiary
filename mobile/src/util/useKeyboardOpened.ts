import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardOpened = () => {
  const [isKeyboardOpened, setKeyboardOpened] = useState(false);
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardOpened(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardOpened(false);
      }
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  return isKeyboardOpened;
};

export default useKeyboardOpened;
