import React from 'react';
import DateTimePicker, {
  ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker';

type DurationPickerProps = ReactNativeModalDateTimePickerProps & {
  deafaultHours: number;
  defaultMinutes: number;
};

const MyTimePicker: React.FC<DurationPickerProps> = (props) => {
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
      is24Hour={true}
    />
  );
};

export default MyTimePicker;
