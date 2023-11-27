import { 
    BrowserRouter, 
    Routes, 
    Route, 
    Navigate 
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import theme from "./themes";
import StateProvider from "./context/state";
import DataloggerProvider from "./context/datalogger";
import DatabaseProvider from "./context/database";
import Navigation from "./components/Navigation";
import Home from "./views/Home";
import views from "./views";

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <StateProvider>
            <DatabaseProvider>
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
                        <Navigation/>
                    </BrowserRouter>
                </DataloggerProvider>
            </DatabaseProvider>
        </StateProvider>
    </ThemeProvider>
);

export default App;