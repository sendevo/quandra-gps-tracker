import { useState, useEffect, forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Box, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";


const Toast = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let exitWatchDog = 0;

const Navigation = () => {

    const [toastOpen, setToastOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleCloseToast = (e, reason) => {
        if (reason === 'clickaway')
            return;
        setToastOpen(false);
    };

    useEffect(() => {        
        if(Capacitor.isNativePlatform()){
            App.removeAllListeners()
            .then(() => {
                App.addListener('backButton', () => {                                        
                    if(location.pathname === '/'){
                        if(Date.now() - exitWatchDog > 3000){
                            setToastOpen(true);                            
                            exitWatchDog = Date.now();
                        }else{
                            App.exitApp();
                        }            
                    }else{
                        navigate(-1);
                    }
                });
            });
        }
    }, [location]);    
    
    return (
        <Box>
            <Snackbar open={toastOpen} autoHideDuration={1500} onClose={handleCloseToast}>
                <Toast severity='info' sx={{ width: '100%' }} onClose={handleCloseToast}>
                    Presione nuevamente para salir
                </Toast>
            </Snackbar>
        </Box>
    );
};

export default Navigation;