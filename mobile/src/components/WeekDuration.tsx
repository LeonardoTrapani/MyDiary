import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import globalStyles from '../constants/Syles';
import MyTimePicker, { useTimePicker } from './MyTimePicker';
import { RegularText } from './StyledText';
import TextButton from './TextButton';
import { View } from './Themed';

const WeekDuration: React.FC<{
  name: string;
}> = (props) => {
  const { isOpened, onCancel, onConfirm, minutes, open } = useTimePicker();
  const h = useMemo(() => Math.floor(minutes / 60), [minutes]);
  const m = useMemo(() => minutes % 60, [minutes]);

  return (
    <View style={[styles.container, globalStyles.smallShadow]}>
      <RegularText style={styles.name}>{props.name}</RegularText>
      <TextButton
        title={`${h}h ${m}m`}
        textStyle={styles.time}
        onPress={open}
      />
      <MyTimePicker
        isVisible={isOpened}
        onCancel={onCancel}
        onConfirm={onConfirm}
        defaultMinutes={m}
        deafaultHours={h}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 13,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
  },
  time: {
    fontSize: 17,
  },
});

export default WeekDuration;
