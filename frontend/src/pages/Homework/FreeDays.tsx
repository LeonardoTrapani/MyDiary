import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createHomeworkActions,
  freeDay,
  HomeworkCreating,
  submitCreateHomework,
} from '../../store/create-homework-slice';
import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
} from '../../utilities/hooks';
import { AiOutlineCalendar } from 'react-icons/ai';
import Slider from '../../components/UI/Slider';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './Homework.module.css';
import Button from '../../components/UI/Button';
import MinutesFromHoursMinutes from '../../components/UI/MinutesFromHoursMinutes';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

export const FreeDays: React.FC<{
  freeDays: freeDay[];
}> = ({ freeDays }) => {
  const { page } = useParams();
  const homeworkPage = page as string;
  const isLoading = useAppSelector((state) => state.createHomework.isLoading);
  const hasError = useAppSelector((state) => state.createHomework.hasError);

  let message = 'Found no more free days';
  if (+homeworkPage === 1) {
    message = 'Found no free days';
  }

  const freeDaysJsx = useMemo(
    () =>
      freeDays.map((freeDay) => {
        return (
          <FreeDay
            date={freeDay.date}
            freeTime={freeDay.freeMinutes}
            key={freeDay.date}
            assignedTime={freeDay.assignedTime}
            freeMinutes={freeDay.freeMinutes}
          />
        );
      }),
    [freeDays]
  );

  if (isLoading) {
    return (
      <div className={styles['center-flex']}>
        <LoadingSpinner />
      </div>
    );
  }
  if (hasError) {
    return (
      <div className={styles['center-flex'] + ' ' + styles['error']}>
        <h2>An error has occurred finding the free days</h2>
      </div>
    );
  }
  if (!freeDaysJsx.length) {
    <div className={styles['center-flex']}>
      <h2 className={styles['free-days--message']}>{message}</h2>
    </div>;
  }
  return <div className={styles['free-days']}>{freeDaysJsx}</div>;
};

export const FreeDayButtons: React.FC = () => {
  const navigate = useNavigate();
  const freeDaysLength = useAppSelector(
    (state) => state.createHomework.freeDays.length
  );
  const { page } = useParams();
  const homeworkPage = page as string;

  const buttonBackHandler = () => {
    navigate('/create-homework/free-days/' + (+homeworkPage - 1));
  };
  const buttonForwardHandler = () => {
    navigate('/create-homework/free-days/' + (+homeworkPage + 1));
  };
  return (
    <div className={styles['free-days--button-container']}>
      <FreeDayButton
        onClick={buttonBackHandler}
        left
        disabled={+homeworkPage === 1}
      />

      <FreeDayButton
        onClick={buttonForwardHandler}
        right
        disabled={freeDaysLength < 9}
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
  const iconSize = 17;
  const iconsWidth = 15;

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
  const sliderDisabled =
    freeMinutes === 0 || (timeToAssign === 0 && assignedTime === 0);
  return (
    <div className={styles['free-day']}>
      <FreeDayDate formattedDate={formattedDate} />
      <div className={styles['free-day--informations']}>
        <FreeDayMinutes freeTime={props.freeTime} />
        <AssignTime timeAssigned={props.assignedTime} />
      </div>
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
      <div>
        <MinutesFromHoursMinutes minutes={props.freeTime} />
      </div>
    </div>
  );
};

const AssignTime: React.FC<{
  timeAssigned: number;
}> = (props) => {
  return (
    <div className={styles['free-day--space-content']}>
      <p>Assigned Time: </p>
      <div>
        <MinutesFromHoursMinutes minutes={props.timeAssigned} />
      </div>
    </div>
  );
};

export default FreeDays;

export const FreeDaysInformations: React.FC = () => {
  const homeworkCreating = useAppSelector(
    (state) => state.createHomework.homeworkCreating as HomeworkCreating
  );
  const isValid = useMemo(
    () => homeworkCreating.timeToAssign === 0,
    [homeworkCreating.timeToAssign]
  );
  const selectedDays = useAppSelector(
    (state) => state.createHomework.selectedDays
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fetchAuthorized = useFetchAuthorized();
  const buttonSubmitHandler = () => {
    dispatch(
      submitCreateHomework(
        isValid,
        fetchAuthorized,
        homeworkCreating,
        selectedDays,
        navigate
      )
    );
  };
  return (
    <div className={styles['free-days--informations']}>
      <FreeDayTitle />
      <TimeToAssign />
      <div className={styles['free-days--informations-actions']}>
        <FreeDayButtons />
        <Button
          isLoading={false}
          isValid={isValid}
          onClick={buttonSubmitHandler}
        >
          Create Homework
        </Button>
      </div>
    </div>
  );
};

export const FreeDayTitle: React.FC = () => {
  const name = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.name
  );
  return <h1 className={styles['time-to-assign--name']}>{name}</h1>;
};

export const TimeToAssign: React.FC = () => {
  const timeToAssign = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.timeToAssign as number
  );
  return (
    <div className={styles['time-to-assign']}>
      <MinutesFromHoursMinutes
        minutes={timeToAssign}
        hoursValueClass={styles['time-to-assign--value']}
        minutesValueClass={styles['time-to-assign--value']}
      />
    </div>
  );
};
