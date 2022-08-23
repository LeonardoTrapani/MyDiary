import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

interface NonModalDurationPicerProps {
  onChangeDuration: (date: Date) => void;
  value: Date;
}

const NonModalDurationPicker: React.FC<NonModalDurationPicerProps> = (props) => {
  const changeHandler = (_: any, date?: Date) => {
    if (date) {
      props.onChangeDuration(date)
    }
  }

  return (
    <DateTimePicker
      mode="time"
      locale="en_GB"
      is24Hour={true}
      display="spinner"
      style={{
        height: 150
      }}
      value={props.value}
      onChange={changeHandler}
    />
  );
};

export default NonModalDurationPicker;
