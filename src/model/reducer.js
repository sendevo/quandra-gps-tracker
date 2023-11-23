import { VERSION_VALUE } from "./constants";

export const initialState = {
    version: VERSION_VALUE,
    recordingState: "IDLE",
    recordingDuration: 0,
    recordingDistance: 0
};

export const reducer = (prevState, action) => {
    switch(action.type) {
        case "START_RECORDING": {
            return {
                ...prevState,
                recordingState: "RECORDING",
                recordingDuration: 0,
                recordingDistance: 0
            };
        }
        case "STOP_RECORDING": {
            return {
                ...prevState,
                recordingState: "IDLE"
            }
        }
        case "POSITION_UPDATE": {
            return {
                ...prevState,
                recordingDistance: action.payload.distance,
                recordingDuration: action.payload.elapsed
            }
        }
    }
};
