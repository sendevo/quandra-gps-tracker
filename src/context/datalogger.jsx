import { Preferences } from '@capacitor/preferences';
import { createContext, useContext, useEffect } from 'react';
import { DispatchContext } from './state';
import { DatabaseContext } from './database';
import { 
    startRecording, 
    positionUpdate, 
    stopRecording 
} from '../model/actions';
import { 
    DATALOGGER_CONFIG_KEY,
    SAMPLE_PERIOD 
} from '../model/constants';
import Datalogger, { defaultConfig } from '../model/datalogger';

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
            if(travel.elapsed > 2*SAMPLE_PERIOD) 
                database.addTravel(travel)
                    .then(() => {
                        console.log("Travel saved successfully");
                    })
                    .catch(console.error)
            else
                console.log("Travel too short! Data was not saved.");
        }
    );

    useEffect( () => {
        Preferences.get({key: DATALOGGER_CONFIG_KEY})
            .then(prefs => {
                const {value} = prefs;
                if(value){
                    const config = JSON.parse(value);
                    if(config)
                        datalogger.setConfig(config);
                }else{
                    Preferences.set({
                        key: DATALOGGER_CONFIG_KEY,
                        value: JSON.stringify(defaultConfig)
                    })
                        .then(() => {
                            console.log("Default config saved to preferences.");
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <DataloggerContext.Provider value={datalogger}>
            {children}
        </DataloggerContext.Provider>
    );
};

export default DataloggerProvider;