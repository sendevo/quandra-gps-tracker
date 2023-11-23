import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import MainView from "../../components/MainView";
import { StateContext, DispatchContext } from "../../context";
import { 
    startRecording, 
    stopRecording, 
    positionUpdate 
} from "../../model/actions";
import RecordButton from "../../components/RecordButton";
import { FaInfoCircle, FaCogs, FaRoute } from "react-icons/fa";

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

    const handleButtonClick = () => {
        if(state.recordingState === "IDLE"){
            startRecording(dispatch);
        }else{
            stopRecording(dispatch);
        }
    };

    return (
        <MainView>
            <RecordButton state={state.recordingState} onClick={handleButtonClick}/>
            <Box sx={styles.infoBox}>
                <Typography>Tiempo de recorrido: {}</Typography>
                <Typography>Distancia de recorrida: {}</Typography>
            </Box>
            <Box sx={styles.aboutButton}>
                <Link to={'/about'}>
                    <FaInfoCircle size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
            <Box sx={styles.configButton}>
                <Link to={'/config'}>
                    <FaCogs size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
            <Box sx={styles.recordsButton}>
                <Link to={'/config'}>
                    <FaRoute size="40px" color="rgb(100,100,100)"/>
                </Link>
            </Box>
        </MainView>
    );
};

export default View;