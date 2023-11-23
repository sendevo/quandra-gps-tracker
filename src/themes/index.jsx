import { createTheme } from "@mui/material/styles"; 

export const globalStyles = {
    a:{ textDecoration: "none", fontWeight: "bold" }
};

export const componentsStyles = {
    paper: {backgroundColor: 'rgb(245, 245, 245)'},
    title: {fontSize: "16px", fontWeight: "bold"},
    hintText: {
        fontStyle: "italic",
        fontSize: "12px",
        padding: "0px",
        margin: "0px",
        lineHeight: "1em",
        color: "rgb(100,100,100)"
    }
};

const theme = createTheme({
    typography: {
        fontFamily: "Montserrat, Open Sans, sans-serif"
    },
    palette: {
        mode: "light",
        red: {main: "#DD0000", contrastText: "#FFFFFF"},
        green: {main: "#007700", contrastText: "#FFFFFF"},
        blue: {main: "#3477FF", contrastText: "#FFFFFF"}
    }
});

export default theme;