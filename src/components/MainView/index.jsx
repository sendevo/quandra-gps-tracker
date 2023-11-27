import { useNavigate } from "react-router-dom";
import { Container, Box } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';

const styles = {
    container: {    
        marginBottom: "100px",
        maxwidth: "700px!important",
        paddingleft: "3%!important",
        paddingright: "3%!important",
    },
    title: {
        fontsize: "1.5em",
        fontweight: "bold",    
        lineheight: "1em",
        margintop: "10px",
        marginbottom: "20px",
        padding: "0px",
    },
    backButton: {
        paddingRight: "10px",
        verticalAlign: "middle",
        cursor: "pointer",
        fontsize: "1rem",
    }
};

const MainView = ({title, children}) => {
    
    const navigate = useNavigate();        
    const onGoBack = () => navigate(-1);

    return (
        <Box>
            <Container sx={styles.container}>
                {title && 
                    <h3 style={styles.title}>
                        <span 
                            style={styles.backButton}
                            title="Volver"
                            onClick={onGoBack}>
                            <FaArrowLeft />
                        </span>
                        {title}
                    </h3>
                }
                {children}            
            </Container>
        </Box>
    );
};

export default MainView;