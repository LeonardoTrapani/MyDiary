import React, { useMemo } from 'react';

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
    <>
      <p
        className={props.generalClassHours}
        style={{
          display: 'inline-block',
        }}
      >
        <span className={props.hoursValueClass}>{h}</span>
        <span className={props.hoursNameClass}>h&nbsp;</span>
      </p>
      <p
        className={props.generalClassMinutes}
        style={{
          display: 'inline-block',
        }}
      >
        <span className={props.minutesValueClass}>{m}</span>
        <span className={props.minutesNameClass}>m</span>
      </p>
    </>
  );
};

export default MinutesToHoursMinutes;
