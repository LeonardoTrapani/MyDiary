import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

interface NonModalDurationPickerProps {
  onChangeDuration: (date: Date) => void;
  value: Date;
}

const NonModalDurationPicker: React.FC<NonModalDurationPickerProps> = (
  props
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeHandler = (_: any, date?: Date) => {
    if (date) {
      props.onChangeDuration(date);
    }
  };

  return (
    <DateTimePicker
      mode="time"
      locale="en_GB"
      is24Hour={true}
      display="spinner"
      style={{
        height: 150,
      }}
      value={props.value}
      onChange={changeHandler}
    />
  );
};

export default NonModalDurationPicker;
