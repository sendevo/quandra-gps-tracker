import { createTheme } from "@mui/material/styles"; 

const theme = createTheme({
    typography: {
        fontFamily: "Montserrat, Open Sans, sans-serif"
    },
    palette: {
        background: {
            default: "#111111"
        },
        mode: "dark",
        text: {
            link: "#eeeeee"
        },
        action: {
            active: "#aaaaaa"
        },
        red: {main: "#DD0000", contrastText: "#FFFFFF"},
        green: {main: "#007700", contrastText: "#FFFFFF"},
        blue: {main: "#3477FF", contrastText: "#FFFFFF"}
    }
});

export default theme;