import React from "react";
import DateTimePicker, {
  ReactNativeModalDateTimePickerProps,
} from "react-native-modal-datetime-picker";

type DurationPickerProps = ReactNativeModalDateTimePickerProps & {
  deafaultHours?: number;
  defaultMinutes?: number;
  maximumTime?: number;
  minimumTime?: number;
};

const MyDurationPicker: React.FC<DurationPickerProps> = (props) => {
  const maxDate = props.maximumTime
    ? zeroDate(Math.floor(props.maximumTime / 60), props.maximumTime % 60)
    : undefined;
  const minDate = props.minimumTime
    ? zeroDate(Math.floor(props.minimumTime / 60), props.minimumTime % 60)
    : undefined;

  return (
    <DateTimePicker
      mode="time"
      date={
        new Date(
          new Date().setHours(
            props.deafaultHours || 0,
            props.defaultMinutes || 0,
            0,
            0
          )
        )
      }
      {...props}
      locale="en_GB"
      maximumDate={maxDate}
      is24Hour={true}
      minimumDate={minDate}
    />
  );
};

const zeroDate = (
  hours: number | undefined = 0,
  minutes: number | undefined = 0
) => {
  return new Date(new Date().setHours(hours, minutes, 0, 0));
};

export default MyDurationPicker;
