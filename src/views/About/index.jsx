import {
    Accordion,
    AccordionSummary,
    AccordionDetails, 
    Box,
    Typography
} from "@mui/material";
import MainView from "../../components/MainView";
import { APP_NAME, VERSION_VALUE } from "../../model/constants";
import { FaChevronDown } from "react-icons/fa";


const styles = {
    accordion: {backgroundColor: "rgba(255, 255, 255, 0.7)"},
    summary: {fontWeight: "bold"}
};

const View = () => (
    <MainView title="Acerca del software">
        <Box>
            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Versión de la aplicación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <h3 style={{margin:0, textAlign:"center"}}>{APP_NAME} {VERSION_VALUE}</h3>
                    <h3 style={{margin:0}}>Staff</h3>
                    <Typography><b>Autor:</b> Matías J. Micheletto</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Descripción de la aplicación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Datos de contacto</Typography>
                </AccordionSummary>
                <AccordionDetails>

                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Términos y condiciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    
                </AccordionDetails>
            </Accordion>

        </Box>
    </MainView>
);

export default View;
