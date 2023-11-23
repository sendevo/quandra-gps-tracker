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
                recordingState: "RECORDING"
            };
        }
        case "STOP_RECORDING": {
            return {
                ...prevState,
                recordingState: "IDLE",
                recordingDuration: 0,
                recordingDistance: 0
            }
        }
        case "POSITION_UPDATE": {
            return {
                ...prevState,
                recordingDistance: prevState.recordingDistance+action.payload.stepDistance,
                recordingDuration: prevState.recordingDuration+action.payload.stepDuration
            }
        }
    }
};
