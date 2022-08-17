import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../constants/Syles';

interface FloatingActionButtonProps extends TouchableOpacityProps {
  color: string;
}
const FloatingActionButton: React.FC<FloatingActionButtonProps> = (props) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: props.color,

          bottom: bottom,
        },
        globalStyles.bigShadow,
      ]}
    >
      {props.children}
    </TouchableOpacity>
  );
};

const buttonDimesions = 65;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: buttonDimesions,
    height: buttonDimesions,
    right: 20,

    borderRadius: buttonDimesions / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default FloatingActionButton;
