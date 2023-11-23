import {
    haversine,
    isLocationAvailable,
    getUserLocation
} from "./utils";
import { SAMPLE_PERIOD } from "./constants";

export default class Datalogger {
    constructor(callback, interval = SAMPLE_PERIOD) {
        // Private
        this._intervalId = null;
        this._hasLocationAccess = false;
        // Public
        this.interval = interval;
        this.route = [];
        this.distance = 0;
        this.elapsed = 0;
        this.callback = callback;
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
        this._intervalId = setInterval(() => this._pushLocation(), this.interval);
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
        return Boolean(this._intervalId);
    }

    getTravel() {
        return this.route;
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
                    }
                    this.route.push({lat, lng, time});
                    const {distance, elapsed} = this;
                    this.callback({lat, lng, time, distance, elapsed});
                })
                .catch(console.err);
    }
};