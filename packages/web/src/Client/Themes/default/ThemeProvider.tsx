import User from '@Client/Logic/User/User';
import React, { useReducer, createContext } from 'react';

interface InitialStateType {
    currentUser: null | User
}

const initialState = {
    currentUser: null
}

const reducer = (state: any, action: any) => {
    return { ...state, ...action };
}

const ThemeContext = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => {}
});

const ThemeProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };