import { useReducer, createContext } from 'react';
import { reducer, initialState } from '../model/reducer';

export const StateContext = createContext();
export const DispatchContext = createContext();

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export default StateProvider;