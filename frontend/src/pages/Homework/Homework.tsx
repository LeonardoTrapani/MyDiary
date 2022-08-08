import React, { useEffect, useMemo } from 'react';
import Form from '../../components/BurgerMenu/Form';
import styles from './Homework.module.css';
import Input from '../../components/UI/Input';

import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
  useInput,
} from '../../utilities/hooks';

import {
  createHomeworkActions,
  freeDay,
  searchFreeDays,
} from '../../store/create-homework-slice';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FreeDays, { FreeDaysInformations } from './FreeDays';
import { addDaysFromToday } from '../../utilities/utilities';
import ReactSelect from 'react-select';
import Dropdown from '../../components/UI/Dropdown';
import { classNames } from 'react-select/dist/declarations/src/utils';

export const AddHomeworkPage: React.FC = () => {
  const {
    errorMessage: nameErrorMessage,
    hasError: nameHasError,
    isValid: isNameValid,
    onChangeValue: onNameChange,
    validate: validateName,
    value: nameValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a name',
    },
    {
      check: (value) => value.length >= 3,
      errorMessage: 'insert at least 3 characters',
    },
  ]);
  const {
    errorMessage: descriptionErrorMessage,
    hasError: descriptionHasError,
    isValid: isDescriptionValid,
    onChangeTextAreaValue: onDescriptionChange,
    validate: validateDescription,
    value: descriptionValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a description',
    },
    {
      check: (value) => value.length >= 5,
      errorMessage: 'insert at least 5 characters',
    },
    {
      check: (value) => value.length <= 400,
      errorMessage: 'insert maximum 400 character',
    },
  ]);

  const {
    errorMessage: durationErrorMessage,
    hasError: durationHasError,
    isValid: isDurationValid,
    onChangeValue: onChangeDuration,
    validate: validateDuration,
    value: durationValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'insert a duration',
    },
    {
      check: (value) => +value >= 5,
      errorMessage: 'minimum 5 minutes',
    },
    {
      check: (value) => {
        try {
          +value;
        } catch {
          return false;
        }
        return true;
      },
      errorMessage: 'insert a number',
    },
  ]);
  const {
    errorMessage: expirationDateErrorMessage,
    hasError: expirationDateHasError,
    isValid: isExpirationDateValid,
    onChangeValue: onChangeExpirationDate,
    validate: validateExpirationDate,
    value: expirationDateValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'insert an expiration date',
    },
  ]);

  const isFormValid =
    isNameValid &&
    isDescriptionValid &&
    isSubjectValid &&
    isDurationValid &&
    isExpirationDateValid;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const addHomeworkSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const defaultPage = 1;

    dispatch(
      createHomeworkActions.setHomeworkCreating({
        description: descriptionValue,
        duration: +durationValue,
        timeToAssign: +durationValue,
        expirationDate: expirationDateValue,
        name: nameValue,
        subjectId: subjectId,
      })
    );
    navigate('/create-homework/free-days/' + defaultPage);
  };

  const validateInputs = () => {
    validateName();
    validateDescription();
    validateDuration();
    validateExpirationDate();
    validateSubject();
  };

  const subjectOptions = [
    { value: 'sadwa', label: 'Tst2' },
    { value: 'TEst', label: 'CIAO' },
  ];

  return (
    <>
      <div className={styles['add-homework-form--container']}>
        <Form
          onSubmit={addHomeworkSubmitHandler}
          buttonName='Add Homework'
          validateInputs={validateInputs}
          isFormValid={isFormValid}
          isFormLoading={false}
        >
          <Input
            errorMessage={nameErrorMessage}
            hasError={nameHasError}
            name='Name'
            onBlur={validateName}
            onChange={onNameChange}
            type='text'
            value={nameValue}
            className={styles['name-input']}
          />
          <Input
            errorMessage={descriptionErrorMessage}
            hasError={descriptionHasError}
            name='Description'
            onBlur={validateDescription}
            onChangeTextArea={onDescriptionChange}
            type='textarea'
            value={descriptionValue}
            className={styles['description-input']}
          />
          <Dropdown
            parentClassName={styles['subject-input']}
            errorMessage='ERROR'
            hasError={false}
            name='Subject'
            options={subjectOptions}
          />
          <Input
            errorMessage={durationErrorMessage}
            hasError={durationHasError}
            name='Duration (minutes)'
            onBlur={validateDuration}
            onChange={onChangeDuration}
            type='number'
            value={durationValue}
            className={styles['duration-input']}
          />
          <Input
            errorMessage={expirationDateErrorMessage}
            hasError={expirationDateHasError}
            name='Expiration Date'
            onBlur={validateExpirationDate}
            onChange={onChangeExpirationDate}
            type='date'
            value={expirationDateValue}
            other={{
              min: new Date().toISOString().split('T')[0],
              max: new Date(addDaysFromToday(365)).toISOString().split('T')[0],
            }}
            className={styles['expiration-input']}
          />
        </Form>
      </div>
    </>
  );
};

export const SelectFreeDays: React.FC<{
  freeDays: freeDay[];
}> = ({ freeDays }) => {
  return (
    <div className={styles['select-free-days']}>
      <FreeDaysInformations />
      <div className={styles['free-days--container']}>
        <FreeDays freeDays={freeDays} />
      </div>
    </div>
  );
};

export const AddedHomeworkWrapper: React.FC = () => {
  const pageParam = useParams().page;
  const navigate = useNavigate();
  const page = useMemo(() => pageParam, [pageParam]);
  if (!page) {
    navigate('create-homework/free-days/1');
  }
  const dispatch = useAppDispatch();
  const fetchAuthorized = useFetchAuthorized();
  const duration = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.duration
  );
  const expirationDate = useAppSelector(
    (state) => state.createHomework.homeworkCreating?.expirationDate
  );

  useEffect(() => {
    if (duration && expirationDate && page) {
      dispatch(
        searchFreeDays(
          {
            durationValue: duration,
            expirationDateValue: expirationDate,
            page: +page,
          },
          fetchAuthorized
        )
      );
    }
  }, [page, dispatch, duration, expirationDate, fetchAuthorized]);
  const isChoosingFreeDay = useAppSelector(
    (state) => state.createHomework.isChoosingFreeDay
  );
  const freeDays = useAppSelector((state) => state.createHomework.freeDays);

  if (isChoosingFreeDay) {
    return <SelectFreeDays freeDays={freeDays} />;
  }
  return <Navigate to='/' />;
};

export const EditHomeworkPage: React.FC = () => {
  return <div>Edit homework</div>;
};
