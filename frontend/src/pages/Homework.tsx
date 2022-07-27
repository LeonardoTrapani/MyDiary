import React, { useEffect } from 'react';
import Form from '../components/BurgerMenu/Form';
import styles from './Homework.module.css';
import Input from '../components/UI/Input';
import { fetchHomework } from '../store/homework-slice';
import {
  useAppDispatch,
  useAppSelector,
  useFetchAuthorized,
  useInput,
} from '../utilities/hooks';

import { BACKEND_URL } from '../utilities/contants';

export const HomePage: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token) as string;
  const homework = useAppSelector((state) => state.homework.homework);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchHomework(token));
  }, [token, dispatch]);

  if (!homework.length) {
    return <h1>No homework</h1>;
  }
  console.log(homework);
  const homeworkJSX = homework.map((hmk) => {
    return (
      <li key={hmk.id}>
        <ul>
          <li>{hmk.name}</li>
          <li>{hmk.description}</li>
          <li>{hmk.subject}</li>
          <li>{hmk.plannedDate.toDateString()}</li>
        </ul>
      </li>
    );
  });
  return <ul>{homeworkJSX}</ul>;
};

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
    errorMessage: subjectErrorMessage,
    hasError: subjectHasError,
    isValid: isSubjectValid,
    onChangeValue: onChangeSubject,
    validate: validateSubject,
    value: subjectValue,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a description',
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

  const fetchAuthorized = useFetchAuthorized();
  const addHomeworkSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    //FETCH AND SAVE IN STATE
    try {
      const res = await fetchAuthorized(BACKEND_URL + '/homework/freeDays/1', {
        method: 'POST',
        requestBody: {
          expirationDate: expirationDateValue,
          duration: durationValue,
        },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form
      onSubmit={addHomeworkSubmitHandler}
      buttonName='Add Homework'
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
      <Input
        errorMessage={subjectErrorMessage}
        hasError={subjectHasError}
        name='Subject'
        onBlur={validateSubject}
        onChange={onChangeSubject}
        type='text'
        value={subjectValue}
        className={styles['subject-input']}
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
        }}
        className={styles['expiration-input']}
      />
    </Form>
  );
};

export const EditHomeworkPage: React.FC = () => {
  return <div>Edit homework</div>;
};
