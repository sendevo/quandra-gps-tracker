import { createContext, useContext } from 'react';
import { DispatchContext } from './state';
import { DatabaseContext } from './database';
import { 
    startRecording, 
    positionUpdate, 
    stopRecording 
} from '../model/actions';
import { SAMPLE_PERIOD } from '../model/constants';
import Datalogger from '../model/datalogger';

export const DataloggerContext = createContext();

const DataloggerProvider = ({ children }) => {
    const dispatch = useContext(DispatchContext);
    const database = useContext(DatabaseContext);

    const datalogger = new Datalogger(
        // Start callback
        () => startRecording(dispatch),

        // Update callback
        payload => positionUpdate(dispatch, payload),

        // Stop callback
        () => {
            stopRecording(dispatch);
            const travel = datalogger.getTravel();
            if(travel.elapsed > SAMPLE_PERIOD) 
                database.addTravel(travel)
                    .then(() => {
                        console.log("Travel saved successfully");
                    })
                    .catch(console.error)
            else
                console.log("Travel too short! Data was not saved.");
        }
    );

    return (
        <DataloggerContext.Provider value={datalogger}>
            {children}
        </DataloggerContext.Provider>
    );
};

export default DataloggerProvider;