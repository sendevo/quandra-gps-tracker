import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress 
} from "@mui/material";


const styles = {
    root: {
        marginTop: "50px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%'
    },
    buttonWrapper: {
        position: 'relative'
    },
    button: {
        borderRadius: '50%',
        width: '70vw',
        height: '70vw',
        fontSize: '1.5rem'
    },
    buttonText: {
        fontSize: "28px"
    },
    circularProgress: {
        position: 'absolute',
        left: 0,
        color: "rgba(250,250,250, 0.7)",
        animationDuration: "5s"
    }
};

const RecordButton = ({onClick, state="IDLE"}) => {

    return (
        <Box sx={styles.root}>
            <Box sx={styles.buttonWrapper}>
                <Button
                    variant="contained"
                    color={state === "IDLE" ? "green" : "red"}
                    sx={styles.button}
                    onClick={onClick}>
                        <Box>
                            <Typography sx={styles.buttonText}>
                                {state === "IDLE" ? 'Iniciar' : 'Grabando'}
                            </Typography>
                            <Typography>
                                {state === "RECORDING" && "Presione para detener"}
                            </Typography>
                        </Box>
                </Button>
                {state==="RECORDING" && (
                    <CircularProgress
                        size={"70vw"}
                        thickness={2}
                        disableShrink
                        onClick={onClick}
                        sx={styles.circularProgress}
                    />
                )}
            </Box>
        </Box>
    );
};

export default RecordButton;