import { Link } from "react-router-dom";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails, 
    Box,
    Typography
} from "@mui/material";
import MainView from "../../components/MainView";
import { 
    PROJECT_NAME,
    APP_NAME, 
    VERSION_CODE, 
    VERSION_VALUE,
    STATIC_ELAPSED_TOLERANCE 
} from "../../model/constants";
import { FaChevronDown } from "react-icons/fa";


const styles = {
    accordion: {backgroundColor: "rgba(255, 255, 255, 0.7)"},
    summary: {fontWeight: "bold"},
    subtitle: {
        mt: 1,
        fontSize: "16px", 
        fontWeight: "bold"
    }
};

const View = () => (
    <MainView title="Acerca del software">
        <Box>
            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Descripción de la aplicación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography><b>{APP_NAME}</b> es una aplicación móvil que permite registrar rutas a partir de la ubicación del dispositivo. Los recorridos se guardan localmente y se envian de forma anónima al servicio de <b>{PROJECT_NAME}</b> para su procesamiento. Como resultado, <b>{PROJECT_NAME}</b> puede analizar y estimar la calidad de la ruta e identificar posibles puntos de mejora.</Typography>
                    <Typography><b>{APP_NAME}</b> es una aplicación gratuita, libre de publicidades y no solicitará a sus usuarios realizar pagos bajo ningún concepto, tampoco autenticarse ni brindar datos personales de ningún tipo.</Typography>
                    <Typography>El inicio y finalización del registro de datos de ubicación se controla manualmente desde la pantalla principal y la sincronización de las rutas no se ejecutará a menos que el usuario lo autorice.</Typography>
                    <Typography>La finalización del registro se realizará automáticamente en caso de que la posición del dispositivo se mantenga constante dentro de cierto radio de tolerancia durante más de {STATIC_ELAPSED_TOLERANCE/6e4} minutos.</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Términos y condiciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={styles.subtitle}>Aceptación de los términos</Typography>
                    <Typography>Al acceder a <b>{APP_NAME}</b> a través de cualquiera de sus versiones móvil u online, usted acepta los términos y condiciones del servicio aquí detallados. El material multimedial, el texto y la información contenida en esta aplicación en cualquiera de sus versiones, es producto del trabajo realizado por <i>Sendevo Software</i>, salvo que se indique lo contrario.</Typography>

                    <Typography sx={styles.subtitle}>Cambios en los términos y condiciones</Typography>
                    <Typography><i>Sendevo Software</i> se reserva los derechos de cambiar o suspender la totalidad o parte de los servicios prestados en cualquier momento.</Typography>

                    <Typography sx={styles.subtitle}>Responsabilidad</Typography>
                    <Typography><i>Sendevo Software</i> se deslinda de toda responsabilidad ante cualquier daño o perjuicio ocasionado por el uso o la imposibilidad de uso de <b>{APP_NAME}</b> y de la información contenida y puesta a disposición por dicha aplicación de software.</Typography>
                    <Typography><i>Sendevo Software</i> no será responsable por la pérdida total o parcial de información que eventualmente haya sido registrada en el contexto de <b>{APP_NAME}</b>. </Typography>

                    <Typography sx={styles.subtitle}>Política de uso</Typography>
                    <Typography>El usuario de <b>{APP_NAME}</b> se compromete a:</Typography>
                    <ol>
                        <li>Emplear esta aplicación, en cualquiera de sus versiones, únicamente para registrar datos georeferenciados de movimiento del dispositivo.</li>
                        <li>Respetar los términos de licencia de la <a href="https://www.gnu.org/licenses/gpl-3.0.html" rel="noopener" target="_blank">GNU General Public License (v3)</a>, en lo que respecta a la edición, modificación y distribución del código fuente de <b>{APP_NAME}</b>.</li>
                        <li>No promocionar o publicitar productos o servicios que no sean propios sin una correspondiente autorización.</li>
                        <li>No infringir la ley de cualquier forma, incluyendo actividades como almacenar o compartir información falsa, fraudulenta o engañosa.</li>
                    </ol>

                    <Typography sx={styles.subtitle}>Privacidad</Typography>
                    <Typography>Toda la información que registra la aplicación móvil <b>{APP_NAME}</b> en su base de datos local no serán compartidas con otras personas a menos que el usuario lo autorice. La aplicación <b>{APP_NAME}</b> no obtendrá ni solicitará acceso a datos personales del usuario. El registro de las rutas y la información de las mismas que se envía para su procesamiento por parte del sistema <b>{PROJECT_NAME}</b> es totalmente anónima.</Typography>

                    <Typography sx={styles.subtitle}>Acceso a la ubicación</Typography>
                    <Typography><b>{APP_NAME}</b> le solicitará permisos al usuario para acceder a la ubicación o geolocalización del dispositivo en que se ejecuta para poder registrar el movimiento y el trazado de las rutas por las que el usuario se desplaza mientras el registro o grabación esté activo.</Typography>

                    <Typography sx={styles.subtitle}>Seguridad</Typography>
                    <Typography><i>Sendevo Software</i> se compromete a realizar lo comercialmente posible por protejer los datos generados por los usuarios de <b>{APP_NAME}</b> de cualquier acceso no autorizado.</Typography>

                    <Typography sx={styles.subtitle}>Servicios de terceros</Typography>
                    <Typography><b>{APP_NAME}</b> puede hacer uso de servicios de terceros, como por ejemplo, proveedores de información o servicios de almacenamiento, sistemas de compras en línea, entre otros. Estos servicios pueden tener acceso a la información que el usuario pone a disposición de <i>Sendevo Software</i> pero están obligados a no revelarla ni utilizarla para otros propósitos.</Typography>

                    <Typography sx={styles.subtitle}>Transpaso de negocio</Typography>
                    <Typography>En caso de que <b>{APP_NAME}</b> o <i>Sendevo Software</i> sean adquiridos por un tercero, la información de los usuarios y sus credenciales pueden estar incluidas en el transpaso de negocio al tercero.</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Información Técnica</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="h5" sx={{mb:2, textAlign:"center"}}>{APP_NAME}</Typography>
                    <Typography><b>Desarrollo:</b> <a href="https://sendevosoftware.com.ar" rel="noopener" target="_blank">Sendevo Software</a></Typography>
                    <Typography><b>Nombre de versión:</b> {VERSION_VALUE}</Typography>
                    <Typography><b>Código de versión:</b> {VERSION_CODE}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={styles.accordion}>
                <AccordionSummary expandIcon={<FaChevronDown />}>
                    <Typography sx={styles.summary}>Datos de contacto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography><b>{APP_NAME}</b> es un producto de <i><a href="https://sendevosoftware.com.ar" rel="noopener" target="_blank">Sendevo Software</a></i>. Ante cualquier duda, consulta o sugerencia, no dude en contactarnos a <a href="mailto:holasendevo@gmail.com?Subject=Ref.%20Presipedia">holasendevo@gmail.com</a></Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    </MainView>
);

export default View;
