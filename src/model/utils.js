import moment from "moment";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import bbox from "@turf/bbox";

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
        const {latitude, longitude} = pos.route;
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

export const location2GoggleMap = (lat, lng) => {
    return `http://www.google.com/maps/place/${lat},${lng}`;
};

/*
export const routeToGeoJSON = route => {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: route.map(point => [point.lng, point.lat])
                }
            }
        ]
    };
};
*/

export const drawRouteOnCanvas = (route, canvas) => {

    const lats = route.map(point => point.lat);
    const lngs = route.map(point => point.lng);
    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);
    const width = maxLat - minLat;
    const height = maxLng - minLng;

    const xScale = 100; // lat -> px
    const yScale = 100; // lng -> px

    // Set the canvas dimensions
    canvas.width = Math.floor(width * xScale);
    canvas.height = Math.floor(height * yScale);

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';

    console.clear();

    route.forEach((point, index) => {
        const x = (point.lat - minLat)*xScale;
        const y = (point.lng - minLng)*yScale;
    
        console.log("  ");
        console.log("-------------");
        console.log("lat", point.lat, "lng", point.lng);
        console.log("minLat", minLat, "maxLat", maxLat);
        console.log("minLng", minLng, "maxLng", maxLng);
        console.log("canvas.width", canvas.width, "canvas.height", canvas.height);
        console.log("x", x, "y", y);
        if (index === 0)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);
    });

    ctx.stroke();
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