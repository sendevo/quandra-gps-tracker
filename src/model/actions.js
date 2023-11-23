
export const startRecording = dispatch => {
    dispatch({
        type: 'START_RECORDING'
    });
};

export const stopRecording = dispatch => {
    dispatch({
        type: 'STOP_RECORDING'
    });
};

export const positionUpdate = (dispatch, step) => {
    const {stepDistance, stepDuration} = step;
    dispatch({
        type: 'POSITION_UPDATE',
        payload: {stepDistance, stepDuration}
    });
};