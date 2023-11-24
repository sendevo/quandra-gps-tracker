import { KeepAwake } from "@capacitor-community/keep-awake";
import {
    haversine,
    isLocationAvailable,
    getUserLocation
} from "./utils";
import { SAMPLE_PERIOD, INACTIVITY_TOLERANCE } from "./constants";

export default class Datalogger {
    constructor(
            startCallback = () => console.log("Start"),
            updateCallback = () => console.log("Update"), 
            stopCallback = () => console.log("Stop"), 
            sampleInterval = SAMPLE_PERIOD, 
            inactivityToleranceMs = INACTIVITY_TOLERANCE) {
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
        this.sampleInterval = sampleInterval;
        this.inactivityToleranceMs = inactivityToleranceMs;
        // Check location permissions
        isLocationAvailable()
            .then(() => {
                this._hasLocationAccess = true;
                console.log("Location accesible");
            })
            .catch(console.error);
        console.log("Datalogger ready.");
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
                        if(dist === 0) {
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