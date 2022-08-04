import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createHomeworkActions,
  freeDay,
} from '../../store/create-homework-slice';
import styles from './Homework.module.css';
import { useAppDispatch, useAppSelector } from '../../utilities/hooks';
import { AiOutlineCalendar } from 'react-icons/ai';
import Slider from '../../components/UI/Slider';

export const FreeDays: React.FC<{
  freeDays: freeDay[];
}> = ({ freeDays }) => {
  const isLoading = useAppSelector((state) => state.createHomework.isLoading);
  const { page } = useParams();
  const createHomeworkLoading = useAppSelector(
    (state) => state.createHomework.isLoading
  );
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const homeworkPage = page as string;
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

  return (
    <div className={styles['free-days--container']}>
      {createHomeworkLoading && <div>Loading...</div>}
      {!createHomeworkLoading && (
        <>
          {freeDaysJsx.length ? (
            <div className={styles['free-days']}>{freeDaysJsx}</div>
          ) : (
            <h2>Found no homework</h2>
          )}
          <button
            onClick={() => {
              navigate('/create-homework/free-days/' + (+homeworkPage - 1));
            }}
          >
            PREVIOUS PAGE
          </button>
          <button
            onClick={() => {
              navigate('/create-homework/free-days/' + (+homeworkPage + 1));
            }}
          >
            NEXT PAGE
          </button>
        </>
      )}
    </div>
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
