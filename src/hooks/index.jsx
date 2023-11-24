import { useContext } from "react";
import { StateContext, DispatchContext } from "../context/state";
import { DatabaseContext } from "../context/database";
import { DataloggerContext } from "../context/datalogger";

export const useDatabase = () => useContext(DatabaseContext);
export const useState = () => [useContext(StateContext),useContext(DispatchContext)];
export const useDatalogger = () => useContext(DataloggerContext);