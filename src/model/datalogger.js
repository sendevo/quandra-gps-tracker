import {
    haversine,
    isLocationAvailable,
    getUserLocation
} from "./utils";

export default class Datalogger {
    constructor(callback, interval = 5000) {
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
            })
            .catch(console.error);
    }

    startLogging() {
        if (this._intervalId || !this._hasLocationAccess ) 
            return false;
        this._intervalId = setInterval(() => this._pushLocation(), this.interval);
        return true;
    }

    stopLogging() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
        return Boolean(this._intervalId);
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
                    const {route, distance, elapsed} = this;
                    this.callback({lat, lng, time, route, distance, elapsed});
                })
                .catch(console.err);
    }
};