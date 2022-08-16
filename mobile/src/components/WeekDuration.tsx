import React from 'react';
import MyTimePicker, { useTimePicker } from './MyTimePicker';
import { RegularText } from './StyledText';
import TextButton from './TextButton';

const WeekDuration: React.FC<{
  name: string;
}> = (props) => {
  const { isOpened, onCancel, onConfirm, minutes, open } = useTimePicker();

  return (
    <>
      <RegularText>{props.name}</RegularText>
      <TextButton title={minutes.toString()} onPress={open} />
      <MyTimePicker
        isVisible={isOpened}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default WeekDuration;
