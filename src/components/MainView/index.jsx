import { useNavigate } from "react-router-dom";
import { Container, Box } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import classes from './style.module.css';

const MainView = ({title, children}) => {
    
    const navigate = useNavigate();        
    const onGoBack = () => navigate(-1);

    return (
        <Box>
            <Container className={classes.Container}>
                {title && 
                    <h3 className={classes.Title}>
                        <span 
                            className={classes.BackButton}
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