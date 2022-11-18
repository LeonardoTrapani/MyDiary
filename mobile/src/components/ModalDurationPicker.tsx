import React from "react";
import DateTimePicker from "react-native-modal-datetime-picker";

interface ModalDurationPickerProps {
  onChangeDuration: (date: Date) => void;
  value: Date;
  setClosed: () => void;
  isVisible: boolean;
  onConfirm: () => void;
}

const ModalDurationPicker: React.FC<ModalDurationPickerProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeHandler = (date: Date) => {
    if (date) {
      props.onChangeDuration(date);
    }
  };

  return (
    <DateTimePicker
      onCancel={props.setClosed}
      onConfirm={changeHandler}
      isVisible={props.isVisible}
      mode="time"
      locale="en_GB"
      is24Hour={true}
      display="spinner"
      date={props.value}
    />
  );
};

export default ModalDurationPicker;
