export type ViewState = 'dashboard' | 'students';

export type ViewAction =
  | { type: 'SHOW_DASHBOARD' }
  | { type: 'SHOW_STUDENTS' };

// reducer
export const viewReducer = (state: ViewState, action: ViewAction): ViewState => {
  switch (action.type) {
    case 'SHOW_DASHBOARD':
      return 'dashboard';
    case 'SHOW_STUDENTS':
      return 'students';
    default:
      return state;
  }
};
