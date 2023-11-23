import { useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import MainView from "../../components/MainView";
import { StateContext, DispatchContext } from "../../context/state";
import { DataloggerContext } from "../../context/datalogger";
import { 
    startRecording, 
    stopRecording
} from "../../model/actions";
import { elapsedMSToHHMM } from "../../model/utils";
import RecordButton from "../../components/RecordButton";
import { FaInfoCircle, FaCogs, FaRoute } from "react-icons/fa";
import { KeepAwake } from "@capacitor-community/keep-awake";

const styles = {
    aboutButton: {
        position: "absolute",
        bottom: "25px",
        right: "25px"
    },
    configButton: {
        position: "absolute",
        top: "25px",
        right: "25px"
    },
    recordsButton: {
        position: "absolute",
        bottom: "25px",
        left: "25px"
    },
    infoBox: {
        marginTop: "20px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
    }
};

const View = () => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const datalogger = useContext(DataloggerContext);

    const handleButtonClick = () => {
        if(state.recordingState === "IDLE"){
            KeepAwake.keepAwake();
            startRecording(dispatch);
            datalogger.start();
        }else{
            KeepAwake.allowSleep();
            datalogger.stop();
            stopRecording(dispatch);
        }
    };

    const elapsedTime = elapsedMSToHHMM(state.recordingDuration);

    return (
        <MainView>
            <RecordButton state={state.recordingState} onClick={handleButtonClick}/>
            <Box sx={styles.infoBox}>
                <Typography>Tiempo de recorrido: {elapsedTime}</Typography>
                <Typography>Distancia de recorrida: {state.recordingDistance.toFixed(2)} km</Typography>
            </Box>
            <Box sx={styles.aboutButton}>
                <Link to={'/about'}>
                    <FaInfoCircle size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
            <Box sx={styles.configButton}>
                <Link to={'/settings'}>
                    <FaCogs size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
            <Box sx={styles.recordsButton}>
                <Link to={'/records'}>
                    <FaRoute size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
        </MainView>
    );
};

export default View;