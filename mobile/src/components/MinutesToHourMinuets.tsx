import React, { useMemo } from 'react';
import { RegularText } from './StyledText';

const MinutesToHoursMinutes: React.FC<{
  minutes: number;
  minutesNameClass?: string;
  hoursNameClass?: string;
  minutesValueClass?: string;
  hoursValueClass?: string;
  generalClassHours?: string;
  generalClassMinutes?: string;
}> = (props) => {
  const h = useMemo(() => Math.floor(props.minutes / 60), [props.minutes]);
  const m = useMemo(() => props.minutes % 60, [props.minutes]);

  return (
    <RegularText>
      {h}h {m}m
    </RegularText>
  );
};

export default MinutesToHoursMinutes;
