import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    Box,
    Grid,
    Paper, 
    Typography,
    Link 
} from "@mui/material";
import moment from "moment";
import MainView from "../../components/MainView";
import { useDatabase } from "../../hooks";
import { 
    elapsedMSToHHMM, 
    location2GoggleMap,
    drawRouteOnCanvas
} from "../../model/utils";
import icon from "../../assets/not-found-icon.png";
import { FaExternalLinkSquareAlt } from "react-icons/fa";


const styles = {
    paper: {
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    canvas: {
        border: "1px solid gray",
        width: "100%"
    }
};

const View = () => {

    const [travel, setTravel] = useState({
        idFound: false,
        created: 0,
        distance: 0,
        elapsed: 0,
        route: []
    });
    const canvasRef = useRef(null);
    const [searchParams] = useSearchParams(); 
    const database = useDatabase();

    useEffect(() => {
        const id = searchParams.get("id");
        if(Boolean(id)){
            database.getTravel(parseInt(id))
                .then(data => {
                    setTravel(prevTravel => ({
                        ...prevTravel,
                        ...data,
                        idFound: true
                    }));
                })
                .catch(console.error);
        }
    }, []);

    useEffect(() => {
        console.log(canvasRef);
        if(canvasRef.current){
            console.log(travel);
            const route = travel.route;
            drawRouteOnCanvas(route, canvasRef.current);
        }else{
            console.error("Canvas not mounted");
        }
    }, [canvasRef, travel]);

    return (
        <MainView title={travel.idFound ? "Detalles de viaje":"Viaje no encontrado"}>
            {travel.idFound ?
                <Paper sx={styles.paper}>
                    <Typography><b>Fecha de viaje:</b> {moment(travel.created).format("DD/MM/YYYY HH:mm")}</Typography>
                    <Typography><b>Duración del viaje:</b> {elapsedMSToHHMM(travel.elapsed)}</Typography>
                    <Typography><b>Distancia recorrida:</b> {travel.distance} km</Typography>
                    <Typography><b>Cantidad de puntos registrados:</b> {travel.route.length}</Typography>
                    <Typography><b>Ubicación:</b></Typography>

                    <Grid container justifyContent={"space-around"}>
                        <Grid item>
                            <Link 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={location2GoggleMap(travel.route[0].lat, travel.route[0].lng)}>
                                Inicio de ruta <FaExternalLinkSquareAlt />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                target="_blank" 
                                rel="noopener noreferrer" 
                                href={location2GoggleMap(travel.route.at(-1).lat, travel.route.at(-1).lng)}>
                                Fin de ruta <FaExternalLinkSquareAlt />
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
                :
                <Box 
                    display={"flex"} 
                    flexDirection={"column"} 
                    alignItems={"center"}
                    sx={{mt: "50%"}}>
                    <img src={icon} height="100px" alt="Sin datos" />
                    <Typography variant="h5" fontWeight={"bold"}>Ruta no encontrada</Typography>
                </Box>
            }
            {travel.idFound && 
                <Paper sx={{...styles.paper, mt:1}}>
                    <Typography><b>Diagrama de ruta</b></Typography>
                    <canvas 
                        height={500}
                        width={500}
                        ref={canvasRef}
                        style={styles.canvas} />
                </Paper>
}
        </MainView>
    );
};

export default View;
