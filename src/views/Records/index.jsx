import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Grid, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Checkbox, 
    Typography, 
    Box 
} from '@mui/material';
import moment from "moment";
import MainView from "../../components/MainView";
import { elapsedMSToHHMM, postDataToURL } from "../../model/utils";
import { API_URL } from "../../model/constants";
import { useDatabase } from "../../model/hooks";
import { FaCheck, FaTimes } from "react-icons/fa";

const styles = {
    paper: {backgroundColor: 'rgba(255, 255, 255, 0.1)'},
    title: {fontSize: "16px", fontWeight: "bold"},
    hintText: {
        fontStyle: "italic",
        fontSize: "12px",
        padding: "0px",
        margin: "0px",
        lineHeight: "1em",
        color: "rgb(100,100,100)"
    },
    headerCell: {fontWeight: "bold",p: '2px 10px'},
    tableCell: {
        padding: '2px 10px',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
};

const View = () => {
    const navigate = useNavigate();
    const database = useDatabase();
    const [travels, setTravels] = useState([]);
    const [selected, setSelected] = useState([]);

    console.log(travels);

    useEffect( () => {
        database.getAllTravels()
            .then(setTravels)
            .catch(console.error);
    },  []);

    const handleSelect = travelId => {
        const selectedIndex = selected.indexOf(travelId);
        const newSelected = [...selected];
        if (selectedIndex === -1)
            newSelected.push(travelId);
        else
            newSelected.splice(selectedIndex, 1);
        setSelected(newSelected);
    };

    const handleSelectAll = sel => {
        if(sel)
            setSelected(travels.map(d => d.id));
        else 
            setSelected([]);
    };

    const handleDelete = () => {
        // TODO: confirm modal && feedback
        const job = selected.map(travelId => database.removeTravel(travelId));
        Promise.all(job)
            .then(() => {
                database.getAllTravels()
                    .then(updatedTravels => {
                        setTravels(updatedTravels);
                        setSelected([]);
                    });
            })
            .catch(console.error);
    };

    const handleOpen = () => {
        if(selected.length === 1){
            const travelId = selected[0];
            navigate(`/travel?id=${travelId}`);
        }else{
            debug("Multpiple selection for edit", "error");
            setSelected([]);
        }
    };

    const handleSincronize = () => {
        if(selected.length === 1){
            // TODO: show preloader with timeout to hide
            const travelId = selected[0];
            database.getTravel(travelId)
                .then(travelData => {
                    postDataToURL(API_URL, travelData)
                        .then(res => {
                            if(res.ok){
                                travelData.syncId = res.travelId;
                                database.addTravel(travelData)
                                    .then(() => {
                                        // TODO: Hide preloader
                                        // TODO: Show feedback
                                        console.log("Synchronization done.");
                                    })
                                    .catch(console.error);
                            }else{
                                // TODO: Hide preloader
                                // TODO: Show feedback
                                console.error("Synchronization error.");
                            }
                        })
                        .catch(console.error); // TODO: Hide preloader
                })
                .catch(console.error); // TODO: Hide preloader
        }else{
            debug("Multpiple selection for sync", "error");
            setSelected([]);
        }
    };

    return (
        <MainView title="Viajes guardados">
            {travels.length > 0 ?
                <Box sx={{mt:2}}>
                    <TableContainer component={Paper} sx={styles.paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={styles.headerCell}>
                                        <Checkbox 
                                            checked={selected.length === travels.length} 
                                            onChange={e => handleSelectAll(e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={styles.headerCell}>Distancia</TableCell>
                                    <TableCell sx={styles.headerCell}>Duración</TableCell>
                                    <TableCell sx={styles.headerCell}>Creación</TableCell>
                                    <TableCell sx={styles.headerCell}>Sincronizado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {travels.map(travel => (
                                <TableRow key={travel.id}>
                                    <TableCell sx={styles.tableCell}>
                                        <Checkbox 
                                            checked={selected.indexOf(travel.id) !== -1} 
                                            onChange={() => handleSelect(travel.id)} />
                                    </TableCell>
                                    <TableCell sx={styles.tableCell}>{travel.distance.toFixed(2)} km</TableCell>
                                    <TableCell sx={styles.tableCell}>{elapsedMSToHHMM(travel.elapsed)}</TableCell>
                                    <TableCell sx={styles.tableCell}>{travel.created ? moment(travel.created).format("DD/MM/YYYY HH:mm") : ""}</TableCell>
                                    <TableCell sx={styles.tableCell}>{travel.syncId ? <FaCheck color="green"/> : <FaTimes color="red"/>}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Paper sx={{...styles.paper, p:1, mt:2}}>
                        <Grid container sx={{mb:1}} direction={"column"}>
                            <Typography sx={{fontWeight:"bold"}}>Acciones</Typography>
                            {selected.length===0 && <Typography sx={styles.hintText}>Seleccione uno o más viajes</Typography>}
                        </Grid>
                        <Grid 
                            container 
                            direction="row"
                            spacing={1}
                            justifyContent="space-around">
                            <Grid item>
                                <Button     
                                    color="green"
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleOpen}>
                                    Abrir
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="blue"
                                    variant="contained"
                                    disabled={selected.length !== 1}
                                    onClick={handleSincronize}>
                                    Sincronizar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button     
                                    color="red"
                                    variant="contained"
                                    disabled={selected.length === 0}
                                    onClick={handleDelete}>
                                    Borrar
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
                :
                <Box 
                    display={"flex"} 
                    flexDirection={"column"} 
                    alignItems={"center"}
                    sx={{mt: "50%"}}>
                    <Typography variant="h5" fontWeight={"bold"}>Aún no hay viajes guardados</Typography>
                </Box>
            }
        </MainView>
    );
};

export default View;