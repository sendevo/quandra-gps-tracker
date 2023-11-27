import moment from "moment";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

const num2ZeroPaddedStr = (num, pad) => num.toString().padStart(pad, "0");

export const elapsedMSToHHMM = elapsed => {
    const duration = moment.duration(elapsed);
    const hours = num2ZeroPaddedStr(duration.hours(), 2);
    const minutes = num2ZeroPaddedStr(duration.minutes(), 2);
    const seconds = num2ZeroPaddedStr(duration.seconds(), 2);

    const formattedTime = [
        duration.hours() > 0 ? `${hours} hs` : "",
        duration.minutes() > 0 || duration.hours() > 0 ? `${minutes} min` : "",
        `${seconds} seg`
    ].filter(Boolean).join(' ');

    return formattedTime || "-";
};

export const haversine = (pos1, pos2) => { // pos:{lat, lng}
    // https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
    const R = 6378.137; // Radius of Earth
    const dLat = pos2.lat * Math.PI / 180 - pos1.lat * Math.PI / 180;
    const dLon = pos2.lng * Math.PI / 180 - pos1.lng * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const dist = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    return dist;
};

export const isLocationAvailable = () => {
    return new Promise((resolve, reject) => {
        Geolocation.checkPermissions()
            .then(permissions => {
                if(permissions.location === "granted")
                    resolve(true);
                else
                    Geolocation.requestPermissions()
                        .then(res => resolve(res.location === "granted"))
                        .catch(reject);
            })
            .catch(reject);
    });
};

export const getUserLocation = () => {
    const resolver = (pos, callback) => {
        const {latitude, longitude} = pos.coords;
        callback({
            lat: latitude,
            lng: longitude
        });
    };

    return new Promise((resolve, reject) => {
        if(Capacitor.isNativePlatform())
            Geolocation.getCurrentPosition({ timeout: 10000 })
                .then( pos => resolver(pos, resolve) )
                .catch(reject);
        else
            navigator.geolocation?.getCurrentPosition(
                pos => resolver(pos, resolve), 
                err => reject(err),
                {maximumAge: 600000, timeout: 10000}
            );
    });
};

export const isValidURL = url => {
    return url.length > 20; // TODO
};

export const postDataToURL = (apiURL, dataString) => {
    const request = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: dataString
    };
    return fetch(apiURL, request);
};