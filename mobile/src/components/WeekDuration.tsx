import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from '../constants/Syles';
import MyTimePicker from './MyDurationPicker';
import { RegularText } from './StyledText';
import TextButton from './TextButton';
import { View } from './Themed';

const WeekDuration: React.FC<{
  name: string;
  onSetValue: (value: number) => void;
  minutes: number;
}> = ({ minutes, name, onSetValue }) => {
  const [isOpened, setIsOpened] = useState(false);

  const open = () => {
    setIsOpened(true);
  };

  const onCancel = () => {
    setIsOpened(false);
  };
  const h = useMemo(() => Math.floor(minutes / 60), [minutes]);
  const m = useMemo(() => minutes % 60, [minutes]);

  return (
    <View style={[globalStyles.smallShadow, styles.container]}>
      <TouchableOpacity style={styles.touchable} onPress={open}>
        <RegularText style={styles.name}>{name}</RegularText>
        <TextButton
          title={`${h}h ${m}m`}
          textStyle={styles.time}
          onPress={open}
        />
        <MyTimePicker
          isVisible={isOpened}
          onCancel={onCancel}
          onConfirm={(date) => {
            setIsOpened(false);
            const minutes = date.getMinutes() + date.getHours() * 60;
            onSetValue(minutes);
          }}
          defaultMinutes={m}
          deafaultHours={h}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    flexDirection: 'row',
  },
  name: {
    fontSize: 17,
  },
  time: {
    fontSize: 17,
  },
});

export default WeekDuration;
