import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { BACKEND_URL } from '../utilities/contants';
import { CustomRequestInit } from '../utilities/hooks';

type Subjects = { id: number; name: string; color: string }[];
interface SubjectsState {
  subjects: Subjects;
  hasError: boolean;
  isLoading: boolean;
}
const initialState: SubjectsState = {
  subjects: [],
  hasError: false,
  isLoading: false,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setHasError(state, action: PayloadAction<boolean>) {
      state.hasError = action.payload;
    },
    setSubjects(state, action: PayloadAction<Subjects>) {
      state.subjects = action.payload;
    },
  },
});

export const fetchSubjects = (
  fetchAuthorized: () => (
    url: string,
    options?: CustomRequestInit | undefined
  ) => unknown
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(subjectsActions.setLoading(true));
      dispatch(subjectsActions.setHasError(false));
      const subjects = (await fetchAuthorized()(
        BACKEND_URL + '/subject/all'
      )) as Subjects;
      dispatch(subjectsActions.setSubjects(subjects));
      setTimeout(() => {
        dispatch(subjectsActions.setLoading(false));
      }, 300);
    } catch (err) {
      dispatch(subjectsActions.setHasError(true));
      dispatch(subjectsActions.setLoading(false));
    }
  };
};

export default subjectsSlice;
export const subjectsActions = subjectsSlice.actions;
