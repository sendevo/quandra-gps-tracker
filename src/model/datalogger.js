import { KeepAwake } from "@capacitor-community/keep-awake";
import moment from "moment";
import {
    haversine,
    isLocationAvailable,
    getUserLocation
} from "./utils";
import { 
    SAMPLE_PERIOD, 
    INACTIVE_TOL_TIME,
    INACTIVE_TOL_DIST,
    MAX_INACTIVE_TOL_DIST, 
    MAX_INACTIVE_TOL_TIME, 
    MAX_SAMPLE_PERIOD, 
    MIN_INACTIVE_TOL_DIST, 
    MIN_INACTIVE_TOL_TIME, 
    MIN_SAMPLE_PERIOD  
} from "./constants";

export const route2CSV = route => route.map(
        point => [
            moment(point.time).format(), // YYYY-MM-DD[T]HH:mm:ss
            point.lat, 
            point.lng
        ].join(",")
    )
    .join("\n");

export const defaultConfig = {
    sampleInterval: SAMPLE_PERIOD,
    inactivityToleranceKm: INACTIVE_TOL_DIST,
    inactivityToleranceMs: INACTIVE_TOL_TIME
};

export default class Datalogger {
    constructor(
            startCallback = () => console.log("Start"),
            updateCallback = () => console.log("Update"), 
            stopCallback = () => console.log("Stop"), 
            config = defaultConfig) {
        // Private
        this._intervalId = null;
        this._hasLocationAccess = false;
        this._inactivityTime = 0;
        // Public
        this.route = [];
        this.distance = 0;
        this.elapsed = 0;
        this.startCallback = startCallback;
        this.updateCallback = updateCallback;
        this.stopCallback = stopCallback;
        this.sampleInterval = config.sampleInterval;
        this.inactivityToleranceMs = config.inactivityToleranceMs;
        this.inactivityToleranceKm = config.inactivityToleranceKm;
        // Check location permissions
        isLocationAvailable()
            .then(() => {
                this._hasLocationAccess = true;
                console.log("Location accesible");
            })
            .catch(console.error);
        console.log("Datalogger ready.");
    }

    setConfig(newConfig) {
        if(
            "sampleInterval" in newConfig && 
            "inactivityToleranceMs" in newConfig && 
            "inactivityToleranceKm" in newConfig
        ){
            const {
                sampleInterval, 
                inactivityToleranceMs, 
                inactivityToleranceKm
            } = newConfig;
            if(sampleInterval <= MAX_SAMPLE_PERIOD && sampleInterval >= MIN_SAMPLE_PERIOD &&
                inactivityToleranceKm <= MAX_INACTIVE_TOL_DIST && inactivityToleranceKm >= MIN_INACTIVE_TOL_DIST &&
                inactivityToleranceMs <= MAX_INACTIVE_TOL_TIME && inactivityToleranceMs >= MIN_INACTIVE_TOL_TIME){
                    this.sampleInterval = sampleInterval;
                    this.inactivityToleranceMs = inactivityToleranceMs;
                    this.inactivityToleranceKm = inactivityToleranceKm;
                return true;
            }else{
                console.error("Wrong parameters values.");
                return false;
            }
        }else{
            console.error("Missing attributes in new config.");
            return false;
        }
    }

    getConfig() {
        const {
            sampleInterval,
            inactivityToleranceMs,
            inactivityToleranceKm
        } = this;
        return {
            sampleInterval,
            inactivityToleranceMs,
            inactivityToleranceKm
        };
    }

    start() {
        if (this._intervalId || !this._hasLocationAccess ) 
            return false;
        this.route = [];
        this.elapsed = 0;
        this.distance = 0;
        this._intervalId = setInterval(() => this._pushLocation(), this.sampleInterval);
        KeepAwake.keepAwake();
        this.startCallback();
        this._pushLocation();
        console.log("Datalogger started.");
        return true;
    }

    stop() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
            console.log("Datalogger stopped.");
        }
        KeepAwake.allowSleep();
        this.stopCallback();
        return Boolean(this._intervalId);
    }

    getTravel() {
        const syncId = ""; // When sinchronized with backend, set uuidv4 value
        const created = Date.now();
        const {route, distance, elapsed} = this;
        return {syncId, created, route, distance, elapsed};
    }

    _pushLocation() {
        if(this._hasLocationAccess)
            getUserLocation()
                .then(currentLocation => {
                    const time = Date.now();
                    const {lat, lng} = currentLocation;
                    if(this.route.length > 1){
                        const lastLocation = this.route.at(-1);
                        const dist = haversine(lastLocation, currentLocation);
                        const dt = time - lastLocation.time;
                        this.distance += dist;
                        this.elapsed += dt;
                        // Check inactivity
                        if(dist < this.inactivityToleranceKm) {
                            this._inactivityTime += dt;
                            if(this._inactivityTime > this.inactivityToleranceMs)
                                this.stop();
                        }else{
                            this._inactivityTime = 0;
                        }
                    }
                    this.route.push({lat, lng, time});
                    const {distance, elapsed} = this;
                    const params = {lat, lng, time, distance, elapsed};
                    this.updateCallback(params);
                })
                .catch(console.err);
    }
};