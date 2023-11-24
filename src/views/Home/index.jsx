import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import MainView from "../../components/MainView";
import {
    useState,
    useDatalogger
} from "../../hooks";
import { elapsedMSToHHMM } from "../../model/utils";
import RecordButton from "../../components/RecordButton";
import { FaInfoCircle, FaCogs, FaRoute } from "react-icons/fa";
import banner from "../../assets/quandra-banner.png";


const styles = {
    logoContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 1,
        mb: 2
    },
    logo: {
        width: "80%",
        maxWidth: "600px",
        maxHeight: "400px",
        objectFit: "contain",
        filter: "contrast(60%) drop-shadow(3px 3px 2px #666)"
    },
    aboutButton: {
        position: "absolute",
        bottom: "25px",
        right: "25px"
    },
    configButton: {
        position: "absolute",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)"
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
    const [state] = useState();
    const datalogger = useDatalogger();

    const handleButtonClick = () => {
        if(state.recordingState === "IDLE")
            datalogger.start();
        else
            datalogger.stop();
    };

    const elapsedTime = elapsedMSToHHMM(state.recordingDuration);

    return (
        <MainView>
            <Box sx={styles.logoContainer}>
                <img style={styles.logo} src={banner} alt="banner" />
            </Box>
            <RecordButton state={state.recordingState} onClick={handleButtonClick}/>
            <Box sx={styles.infoBox}>
                <Typography>Tiempo de recorrido: {elapsedTime}</Typography>
                <Typography>Distancia de recorrida: {state.recordingDistance.toFixed(2)} km</Typography>
            </Box>
            <Box sx={styles.aboutButton}>
                <Link to={'/about'}>
                    <FaInfoCircle size="40px" color="rgb(200,200,200)"/>
                </Link>
            </Box>
            <Box sx={styles.configButton}>
                <Link to={'/settings'}>
                    <FaCogs size="40px" color="rgb(200,200,200)"/>
                </Link>
            </Box>
            <Box sx={styles.recordsButton}>
                <Link to={'/records'}>
                    <FaRoute size="40px" color="rgb(200,200,200)"/>
                </Link>
            </Box>
        </MainView>
    );
};

export default View;