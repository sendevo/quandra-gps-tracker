import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate 
} from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import theme, { globalStyles } from "./themes";
import StateProvider from "./context/state";
import DataloggerProvider from "./context/datalogger";
import Home from "./views/Home";
import views from "./views";

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles}/>
        <StateProvider>
            <DataloggerProvider>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home/>} />
                        {
                            views.map((v, index) => (
                                <Route key={index} path={v.path} element={v.component} />
                            ))        
                        }
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </Routes>
                </BrowserRouter>
            </DataloggerProvider>
        </StateProvider>
    </ThemeProvider>
);

export default App;