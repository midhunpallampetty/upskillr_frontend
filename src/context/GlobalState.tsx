import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// 1. Define state shape
type GlobalState = {
  isDarkMode: boolean;
  // Add more global state items here
};

type Action = { type: 'TOGGLE_DARK_MODE' };

// 2. Initial state
const initialState: GlobalState = {
  isDarkMode: false,
};

// 3. Reducer
function reducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
}

// 4. Create contexts
const StateContext = createContext<GlobalState | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

// 5. Provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

// 6. Custom hooks for ease of use
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
