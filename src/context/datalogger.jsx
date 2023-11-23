import { createContext, useContext } from 'react';
import { DispatchContext } from './state';
import { positionUpdate } from '../model/actions';
import Datalogger from '../model/datalogger';


export const DataloggerContext = createContext();

const DataloggerProvider = ({ children }) => {
    const dispatch = useContext(DispatchContext);

    const dataloggerInstance = new Datalogger(payload => {
        positionUpdate(dispatch, payload);
    });

    return (
        <DataloggerContext.Provider value={dataloggerInstance}>
            {children}
        </DataloggerContext.Provider>
    );
};

export default DataloggerProvider;