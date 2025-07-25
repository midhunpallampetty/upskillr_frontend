import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Student } from '../features/student/types/School';

// 1. Define state shape
type GlobalState = {
  isDarkMode: boolean;
  course: string | null;
  schoolName: string | null;
  student: Student | null; // ✅ Added student to global state
};

// 2. Define actions
type Action =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_COURSE'; payload: string | null }
  | { type: 'SET_SCHOOL_NAME'; payload: string | null }
  | { type: 'SET_STUDENT'; payload: Student | null }; // ✅ Fix typo: remove extra semicolon

// 3. Initial state
const initialState: GlobalState = {
  isDarkMode: false,
  course: null,
  schoolName: null,
  student: null, // ✅ Added student to initial state
};

// 4. Reducer
function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_COURSE':
      return { ...state, course: action.payload };
    case 'SET_SCHOOL_NAME':
      return { ...state, schoolName: action.payload };
    case 'SET_STUDENT':
      return { ...state, student: action.payload }; // ✅ Handle student in reducer
    default:
      return state;
  }
}

// 5. Create contexts
const StateContext = createContext<GlobalState | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

// 6. Provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

// 7. Custom hooks for consuming context
export const useGlobalState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalProvider');
  return context;
};

export const useGlobalDispatch = () => {
  const context = useContext(DispatchContext);
  if (!context) throw new Error('useGlobalDispatch must be used within GlobalProvider');
  return context;
};

// 8. Optional utility hooks
export const useSetCourse = () => {
  const dispatch = useGlobalDispatch();
  return (course: string | null) => {
    dispatch({ type: 'SET_COURSE', payload: course });
  };
};

export const useSetSchoolName = () => {
  const dispatch = useGlobalDispatch();
  return (schoolName: string | null) => {
    dispatch({ type: 'SET_SCHOOL_NAME', payload: schoolName });
  };
};

// ✅ 9. New utility hook for setting student globally
export const useSetStudent = () => {
  const dispatch = useGlobalDispatch();
  return (student: Student | null) => {
    dispatch({ type: 'SET_STUDENT', payload: student });
  };
};
