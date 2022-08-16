import React, { useState } from 'react';
import DateTimePicker, {
  ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker';

type DurationPickerProps = ReactNativeModalDateTimePickerProps & {
  deafaultHours: number;
  defaultMinutes: number;
};

const DurationPicker: React.FC<DurationPickerProps> = (props) => {
  return (
    <DateTimePicker
      mode='time'
      date={
        new Date(
          new Date().setHours(props.deafaultHours, props.defaultMinutes, 0, 0)
        )
      }
      {...props}
      locale='en_GB'
    />
  );
};

export default DurationPicker;

export const useTimePicker = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [minutes, setMinutes] = useState(0);

  const open = () => {
    setIsOpened(true);
  };
  const onConfirm = (date: Date) => {
    setIsOpened(false);
    const minutes = date.getMinutes() + date.getHours() * 60;
    setMinutes(minutes);
  };

  const onCancel = () => {
    setIsOpened(false);
  };
  return { isOpened, minutes, onConfirm, onCancel, open };
};
