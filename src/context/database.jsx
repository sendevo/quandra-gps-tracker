import { createContext, useContext } from "react";
import LocalDatabase from "../model/database";

export const DatabaseContext = createContext();

const DatabaseProvider = ({children}) => {
    const database = new LocalDatabase();
    
    return (
        <DatabaseContext.Provider value={database}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;