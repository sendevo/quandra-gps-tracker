import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { 
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
        elapsed: 0
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
            //const route = travel.route;
            const route = [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 34.0522, lng: -118.2437 },
                { lat: 40.7128, lng: -74.0060 },
                { lat: 37.7749, lng: -122.4194 }
            ];
            drawRouteOnCanvas(route, canvasRef.current);
        }else{
            console.error("error on canvas");
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
                    <Typography><b>Ubicaciones:</b></Typography>

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
                    <Typography sx={{mt:1}}><b>Diagrama de ruta</b></Typography>
                    <canvas 
                        height={500}
                        width={500}
                        ref={canvasRef}
                        style={styles.canvas} />
                </Paper>
                :
                <Paper>
                    <Typography><b>Datos de viaje no encontrados</b></Typography>
                </Paper> 
            }
        </MainView>
    );
};

export default View;
