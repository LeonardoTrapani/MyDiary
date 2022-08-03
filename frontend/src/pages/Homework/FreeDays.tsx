import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { freeDay } from '../../store/create-homework-slice';
import styles from './Homework.module.css';
import { useAppDispatch, useAppSelector } from '../../utilities/hooks';
import { AiOutlineCalendar } from 'react-icons/ai';
import Button from '../../components/UI/Button';
import { Modal } from '../../components/UI/Overlays';
import { createPortal } from 'react-dom';
import { assignTimeActions } from '../../store/assign-time-slice';
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
}> = (props) => {
  const formattedDate = new Date(props.date).toDateString();
  const isModalOpened = useAppSelector((state) => state.assignTime.modalOpened);
  const dispatch = useAppDispatch();
  const assignTimeClickHandler = () => {
    dispatch(
      assignTimeActions.assignTime({
        freeMinutes: props.freeTime,
        timeAssigned: props.assignedTime,
        date: props.date,
      })
    );
  };
  return (
    <div className={styles['free-day']}>
      <FreeDayDate formattedDate={formattedDate} />
      <FreeDayMinutes freeTime={props.freeTime} />
      <AssignTime timeAssigned={props.assignedTime} />
      <div className={styles['free-day--button-container']}>
        <Button
          onClick={assignTimeClickHandler}
          isLoading={false}
          isValid={true}
          className={styles['free-day--button']}
        >
          Assign Time
        </Button>
      </div>
      <AssignTimeModal isOpen={isModalOpened} />
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

const AssignTimeModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const dispatch = useAppDispatch();
  const closeModalHandler = () => {
    dispatch(assignTimeActions.setModalOpened(false));
  };
  return createPortal(
    <Modal onClose={closeModalHandler} isOpen={isOpen}>
      <AssignTimeInformations />
    </Modal>,
    document.getElementById('overlays') as HTMLDivElement
  );
};

const AssignTimeInformations: React.FC = () => {
  const dayInformations = useAppSelector(
    (state) => state.assignTime.dayInformations
  );
  return (
    <div>
      <FreeDayDate formattedDate={dayInformations.date} />
      <FreeDayMinutes freeTime={dayInformations.freeMinutes} />
      <AssignTime timeAssigned={dayInformations.timeAssigned} />
    </div>
  );
};
export default FreeDays;
