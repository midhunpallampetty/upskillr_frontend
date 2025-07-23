// types
export interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
  message: string;
}

export type LoginAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'CLEAR_MESSAGE' };

// reducer
export const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'CLEAR_MESSAGE':
      return { ...state, message: '' };
    default:
      return state;
  }
};

// initial state
export const initialLoginState: LoginState = {
  email: '',
  password: '',
  showPassword: false,
  message: '',
};
