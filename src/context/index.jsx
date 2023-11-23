import { useReducer, createContext, useEffect } from 'react';
import { reducer, initialState } from '../model/reducer';
import { LS_STATE_KEY, VERSION_VALUE } from '../model/constants';


const getInitialState = () => { // Try to retrieve initial state from localstorage
    const prevState = localStorage.getItem(LS_STATE_KEY);
    const parsed = prevState ? JSON.parse(prevState) : {};
    // In case of app updating, localstorage should be cleared, but in case it doesn't
    if(parsed.version === VERSION_VALUE){ 
        return parsed;
    }else{ // If version mismatch, clear localstorage
        localStorage.setItem(LS_STATE_KEY, JSON.stringify(initialState));
        return initialState;
    }
};

export const StateContext = createContext();
export const DispatchContext = createContext();

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, getInitialState());

    useEffect(() => {
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export default StateProvider;