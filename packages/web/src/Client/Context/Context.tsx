import Config from '../Config/Config';
import React, { useReducer, createContext } from 'react';

interface InitialStateType {
    currentTheme: string
}

const initialState = {
    currentTheme: Config.CURRENT_THEME
}

const reducer = (state: any, action: any) => {
    return { ...state, ...action };
}

const GeneralContext = createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => {}
});

const GeneralProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <GeneralContext.Provider value={{ state, dispatch }}>
            {children}
        </GeneralContext.Provider>
    );
};

export { GeneralContext, GeneralProvider };