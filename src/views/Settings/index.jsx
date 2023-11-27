import { useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import { Grid, Typography } from "@mui/material";
import { useDatalogger } from "../../hooks";
import MainView from "../../components/MainView"
import {
    Input,
    Slider
 } from "../../components/Inputs"
import { FaGlobe } from "react-icons/fa";
import { 
    API_URL_KEY, 
    SAMPLE_PERIOD,
    MAX_SAMPLE_PERIOD,
    INACTIVE_TOL_TIME,
    MAX_INACTIVE_TOL_TIME,
    MIN_INACTIVE_TOL_TIME,
    INACTIVE_TOL_DIST,
    MAX_INACTIVE_TOL_DIST,
    MIN_INACTIVE_TOL_DIST, 
    DEFAULT_API_URL,
    DATALOGGER_CONFIG_KEY
} from "../../model/constants";
import { isValidURL } from "../../model/utils";

const styles = {
    section: {
        mt: 1,
        lineHeight:"1em",
        fontSize: "16px"
    }
};

const View = () => {

    const datalogger = useDatalogger();

    const [config, setConfig] = useState(datalogger.getConfig());
    const [apiUrl, setAPIUrl] = useState(DEFAULT_API_URL);

    const validURL = isValidURL(apiUrl);

    useEffect( () => {
        Preferences.get({key: API_URL_KEY})
            .then(prefs => {
                const {value} = prefs;
                if(value){
                    setAPIUrl(value);
                }else{
                    Preferences.set({ 
                        key: API_URL_KEY,
                        value: DEFAULT_API_URL
                    })
                        .then(() => {
                            console.log("Default API URL saved to preferences.");
                        })
                        .catch(console.error);
                }
                setConfig(datalogger.getConfig());
            })
            .catch(console.error);
    }, []);

    const handleApiUrlChange = e => {
        if(validURL){
            Preferences.set({
                    key: API_URL_KEY, 
                    value: apiUrl
                })
                .then(() => console.log("API URL saved in Preferences."))
                .catch(console.error);
        }
        setAPIUrl(e.target.value);
    };

    const handleConfigChange = (name, value) => { 
        setConfig(prevConfig => {
            const newConfig = {
                ...prevConfig,
                [name]: value
            };
            const result = datalogger.setConfig(newConfig);
            if(result){
                Preferences.set({
                    key: DATALOGGER_CONFIG_KEY, 
                    value: JSON.stringify(newConfig)
                })
                    .then(()=>{
                        console.log("Datalogger config saved in Preferences.")
                    })
                    .catch(console.error);
            }else{
                console.error("Error in config parameters.");
            }
            return result ? newConfig : prevConfig;
        });
    };

    return (
        <MainView title="Configuración">
            <Grid container direction={"column"} spacing={1}>
                <Grid item>
                    <Input
                        icon={<FaGlobe/>}
                        rIcon={true}
                        name="url"
                        label="API URL"
                        type="text"
                        value={apiUrl || ""}
                        error={!validURL}
                        onChange={handleApiUrlChange} />
                </Grid>
                <Grid item sx={{mt:1}}>
                    <Typography sx={styles.section}>Registro de ruta</Typography>
                </Grid>
                <Grid item>
                    <Slider 
                        label={`Actualizar posición cada ${config.sampleInterval/1000} segundos`}
                        name="sampleInterval"
                        withmarks="true" 
                        min={0} 
                        max={MAX_SAMPLE_PERIOD/1000} 
                        ticks={5} 
                        step={1}
                        value={config.sampleInterval/1000 || SAMPLE_PERIOD/1000}
                        onChange={e => handleConfigChange(e.target.name, e.target.value*1000)}
                        suffix="segundos"/>
                </Grid>
                <Grid item sx={{mt:1}}>
                    <Typography sx={styles.section}>Detección de inactividad</Typography>
                </Grid>
                <Grid item>
                    <Slider 
                        label={`Detener luego de ${config.inactivityToleranceMs/60000} minutos`}
                        name="inactivityToleranceMs"
                        withmarks="true" 
                        min={MIN_INACTIVE_TOL_TIME/60000} 
                        max={MAX_INACTIVE_TOL_TIME/60000} 
                        ticks={5} 
                        step={1}
                        value={config.inactivityToleranceMs/60000 || INACTIVE_TOL_TIME/60000}
                        onChange={e => handleConfigChange(e.target.name, e.target.value*60000)}
                        suffix="minutos"/>
                </Grid>
                <Grid item>
                    <Slider 
                        label={`Radio de tolerancia: ${config.inactivityToleranceKm*1000} metros`}
                        name="inactivityToleranceKm"
                        withmarks="true" 
                        min={MIN_INACTIVE_TOL_DIST*1000} 
                        max={MAX_INACTIVE_TOL_DIST*1000} 
                        ticks={5} 
                        step={1}
                        value={config.inactivityToleranceKm*1000 || INACTIVE_TOL_DIST*1000}
                        onChange={e => handleConfigChange(e.target.name, e.target.value/1000)}
                        suffix="metros"/>
                </Grid>
            </Grid>
        </MainView>
    );
};

export default View;