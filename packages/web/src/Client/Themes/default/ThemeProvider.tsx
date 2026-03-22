import React, { useReducer, createContext } from 'react';
import User from '../../Logic/User/User';

interface InitialStateType {
    currentUser: null | User
}

const initialState: InitialStateType = {
    currentUser: null
};

const reducer = (state: InitialStateType, action: any) => {
    return { ...state, ...action };
};

const ThemeContext = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => {}
});

const ThemeProvider = (props: { children?: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };