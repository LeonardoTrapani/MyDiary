import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createHomeworkActions,
  freeDay,
} from '../../store/create-homework-slice';
import { useAppDispatch, useAppSelector } from '../../utilities/hooks';
import { AiOutlineCalendar } from 'react-icons/ai';
import Slider from '../../components/UI/Slider';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './Homework.module.css';
export const FreeDays: React.FC<{
  freeDays: freeDay[];
}> = ({ freeDays }) => {
  const { page } = useParams();
  const homeworkPage = page as string;

  const createHomeworkLoading = useAppSelector(
    (state) => state.createHomework.isLoading
  );

  let message = 'Found no more free days';
  if (+homeworkPage === 1) {
    message = 'Found no free days';
  }

  const freeDaysJsx = freeDays.map((freeDay) => {
    return (
      <FreeDay
        date={freeDay.date}
        freeTime={freeDay.freeMinutes}
        key={freeDay.date}
        assignedTime={freeDay.assignedTime}
        freeMinutes={freeDay.freeMinutes}
      />
    );
  });
  const navigate = useNavigate();

  const buttonBackHandler = () => {
    navigate('/create-homework/free-days/' + (+homeworkPage - 1));
  };
  const buttonForwardHandler = () => {
    navigate('/create-homework/free-days/' + (+homeworkPage + 1));
  };

  return (
    <div className={styles['free-days--container']}>
      <FreeDayButton
        onClick={buttonBackHandler}
        left
        disabled={+homeworkPage === 1}
      />

      {!createHomeworkLoading && (
        <>
          {freeDaysJsx.length ? (
            <div className={styles['free-days']}>{freeDaysJsx}</div>
          ) : (
            <h2 className={styles['free-days--message']}>{message}</h2>
          )}
        </>
      )}

      <FreeDayButton
        onClick={buttonForwardHandler}
        right
        disabled={!freeDaysJsx.length}
      />
    </div>
  );
};

export const FreeDayButton: React.FC<{
  onClick: () => void;
  right?: boolean;
  left?: boolean;
  disabled: boolean;
}> = (props) => {
  const iconSize = 20;
  const iconsWidth = 8;

  return (
    <button
      onClick={props.onClick}
      className={
        styles['free-day--button'] +
        ' ' +
        (props.disabled ? styles['free-day--button_disabled'] : '')
      }
      disabled={props.disabled}
    >
      {props.left && (
        <IoIosArrowBack
          size={iconSize}
          strokeWidth={iconsWidth}
          className={styles['free-day--icon-left']}
        />
      )}
      {props.right && (
        <IoIosArrowForward
          size={iconSize}
          strokeWidth={iconsWidth}
          className={styles['free-day--icon-right']}
        />
      )}
    </button>
  );
};

export const FreeDay: React.FC<{
  date: string;
  freeTime: number;
  assignedTime: number;
  freeMinutes: number;
}> = (props) => {
  const { assignedTime, freeMinutes } = props;
  const formattedDate = new Date(props.date).toDateString();
  const dispatch = useAppDispatch();
  const timeToAssign = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.timeToAssign as number
  );

  const sliderChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      createHomeworkActions.assignedTimeChange({
        assignedTime: +event.target.value,
        freeDay: {
          date: props.date,
          assignedTime: props.assignedTime,
          freeMinutes: props.freeTime,
        },
      })
    );
  };
  const sliderDisabled = timeToAssign === 0 && assignedTime === 0;
  return (
    <div className={styles['free-day']}>
      <FreeDayDate formattedDate={formattedDate} />
      <FreeDayMinutes freeTime={props.freeTime} />
      <AssignTime timeAssigned={props.assignedTime} />
      <Slider
        disabled={sliderDisabled}
        max={freeMinutes}
        min={0}
        value={assignedTime}
        onChange={sliderChangeHandler}
      />
    </div>
  );
};

const FreeDayDate: React.FC<{ formattedDate: string }> = ({
  formattedDate,
}) => {
  return (
    <div className={styles['free-day--date']}>
      <h2>{formattedDate}</h2>
      <AiOutlineCalendar size='24' />
    </div>
  );
};

const FreeDayMinutes: React.FC<{ freeTime: number }> = (props) => {
  return (
    <div className={styles['free-day--space-content']}>
      <p>Free minutes: </p>
      <p>{props.freeTime}</p>
    </div>
  );
};

const AssignTime: React.FC<{
  timeAssigned: number;
}> = (props) => {
  return (
    <div className={styles['free-day--space-content']}>
      <p>Assigned Time: </p>
      <p>{props.timeAssigned}</p>
    </div>
  );
};

export default FreeDays;
