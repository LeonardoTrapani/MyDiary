import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { StyleSheet } from 'react-native';
import globalStyles from '../constants/Syles';

interface FloatingButtonProps extends TouchableOpacityProps {
  ionIconName: string;
  color: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = (props) => {
  const { background } = useTheme().colors;
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        { backgroundColor: props.color },
        globalStyles.shadow,
      ]}
    >
      <Ionicons
        name='add'
        size={iconSize}
        color={background}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const buttonDimesions = 60;
const iconSize = 30;
const styles = StyleSheet.create({
  button: {
    width: buttonDimesions,
    height: buttonDimesions,
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: buttonDimesions / 2,
    bottom: 15,
  },
  icon: {
    height: iconSize,
    width: iconSize,
    lineHeight: iconSize,
    paddingLeft: '3%',
    paddingTop: '1.5%',
    textAlign: 'center',
  },
});
export default FloatingButton;
