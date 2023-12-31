import { useState } from 'react';
import { Box, Grid, Slider as MuiSlider } from '@mui/material';
import classes from '../style.module.css';

const getMarks = (min, max, length) => Array.from({length}, (_, i) => (min + (max-min)/(length-1)*i))
    .map(v => ({
        value: v,
        label: <span>{v}</span>
    }));

const Slider = props => {

    const [iconLoaded, setIconLoaded] = useState(false);

    return (
        <Grid container spacing={2} alignItems="center" sx={{mt:"5px"}}>
            {props.icon && 
            <Grid item xs={2} display={iconLoaded ? 'block':'none'}>
                <img onLoad={()=>setIconLoaded(true)} src={props.icon} className={classes.Icon} alt="Icon" onClick={props.onIconClick}/>
            </Grid>
            }
            <Grid item xs={props.icon && iconLoaded ? 10 : 12}>
                <span style={props.error && {color: "red"}} className={classes.Title}>{props.label}</span>
                <Box style={props.error && {border: "1px solid red"}} className={classes.InputContainer}>
                    <MuiSlider
                        color={props.error ? "red" : "primary"}
                        size={props.size || "medium"}
                        className={classes.Slider}
                        valueLabelDisplay="auto"
                        marks={props.withmarks && getMarks(props.min, props.max, props.ticks)}
                        valueLabelFormat={v=>`${v} ${props.suffix}`}
                        {...props} />
                </Box>
            </Grid>
        </Grid>
    );
};

export default Slider;