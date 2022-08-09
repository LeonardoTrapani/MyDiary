import React, { useEffect, useMemo, useState } from 'react';
import Form from '../../components/BurgerMenu/Form';
import styles from './Homework.module.css';
import Input from '../../components/UI/Input';

import {
  useAppDispatch,
  useAppSelector,
  useDropdown,
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
import { addDaysFromToday, isHexColor } from '../../utilities/utilities';
import Dropdown from '../../components/UI/Dropdown';
import {
  createSubject,
  fetchSubjects,
  subjectsActions,
} from '../../store/subjects-slice';
import { Modal } from '../../components/UI/Overlays';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

export const AddHomeworkPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchAuthorized = useFetchAuthorized();

  useEffect(() => {
    dispatch(fetchSubjects(fetchAuthorized));
  }, [dispatch, fetchAuthorized]);

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
    errorMessage: subjectErrorMesssage,
    hasError: subjectHasError,
    isValid: isSubjectValid,
    handleChange: onSubjectChange,
    validate: validateSubject,
    value: subjectIndex,
    onCreateOption: onSubjectCreateOption,
  } = useDropdown([
    {
      check: (value) => !!value,
      errorMessage: 'please choose a subject',
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
        subjectId: subjects[+subjectIndex].id,
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

  const subjects = useAppSelector((state) => state.subjects.subjects);

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject, index) => {
        return {
          value: index.toString(),
          label: subject.name,
        };
      }),
    [subjects]
  );

  const subjectColors = useMemo(() => {
    return subjects.map((subject) => {
      return subject.color;
    });
  }, [subjects]);

  return (
    <>
      <CreateSubjectModal />
      <div className={styles['add-homework-form--container']}>
        <Form
          className=''
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
            errorMessage={subjectErrorMesssage}
            hasError={subjectHasError}
            name='Subject'
            options={subjectOptions}
            colors={subjectColors}
            onBlur={validateSubject}
            onChange={onSubjectChange}
            onCreateOption={onSubjectCreateOption}
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

export const CreateSubjectModal: React.FC = () => {
  const creatingSubject = useAppSelector(
    (state) => state.subjects.creatingSubject
  );

  const modalCloseHandler = () => {
    dispatch(subjectsActions.removeCreatingSubject());
  };

  const creatingSubjectName = useAppSelector(
    (state) => state.subjects.creatingSubjectName
  );

  const {
    errorMessage: subjectNameErrorMessage,
    hasError: subjectNameHasError,
    isValid: isSubjectNameValid,
    onChangeValue: onChangeSubjectName,
    validate: validateSubjectName,
    value: subjectNameValue,
    manualSetValue: manualSubjectSetValue,
    reset: resetSubjectName,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please enter a subject name',
    },
  ]);
  const {
    errorMessage: colorErrorMessage,
    hasError: colorHasError,
    isValid: IsColorValid,
    onChangeValue: onColorChangeValue,
    validate: validateColor,
    value: colorValue,
    reset: resetColor,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: 'please insert a color',
    },
    {
      check: (value) => {
        return isHexColor(value);
      },
      errorMessage: 'insert a valid hex color',
    },
  ]);
  useEffect(() => {
    if (creatingSubjectName) {
      manualSubjectSetValue(creatingSubjectName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatingSubjectName]);

  const fetchAuthorized = useFetchAuthorized();
  const dispatch = useAppDispatch();

  const modalFormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetColor();
    resetSubjectName();
    dispatch(createSubject(fetchAuthorized, subjectNameValue, colorValue));
  };
  const isFormValid = isSubjectNameValid && IsColorValid;
  const [color, setColor] = useState('#1f2937');
  useEffect(() => {
    if (IsColorValid) {
      setColor(colorValue);
    }
  }, [colorValue, IsColorValid]);
  const isLoading = useAppSelector((state) => state.subjects.isLoading);
  const hasError = useAppSelector((state) => state.subjects.hasError);

  return (
    <Modal isOpen={creatingSubject} onClose={modalCloseHandler}>
      <h2 className={styles['modal-title']}>Create Subject</h2>
      {isLoading ? (
        <LoadingSpinner />
      ) : hasError ? (
        <h2 className={styles.error}>
          An error has occurred creating the subject
        </h2>
      ) : (
        <Form
          isFormValid={isFormValid}
          buttonName='Create subject'
          isFormLoading={false}
          onSubmit={modalFormSubmitHandler}
          validateInputs={() => {
            validateSubjectName();
            validateColor();
          }}
          className={styles['modal-form']}
        >
          <Input
            style={{
              color,
            }}
            name='Subject Name'
            errorMessage={subjectNameErrorMessage}
            hasError={subjectNameHasError}
            onBlur={validateSubjectName}
            type='text'
            value={subjectNameValue}
            onChange={onChangeSubjectName}
            className={styles['modal-input-name']}
          />
          <Input
            style={{
              color,
            }}
            name='Color'
            errorMessage={colorErrorMessage}
            hasError={colorHasError}
            onBlur={validateColor}
            value={colorValue}
            type='text'
            onChange={onColorChangeValue}
            className={styles['modal-input-color']}
          />
        </Form>
      )}
    </Modal>
  );
};
