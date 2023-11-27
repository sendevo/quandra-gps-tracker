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

const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const drawPoint = (ctx, x, y, text="") => {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
};

export const drawRouteOnCanvas = (route, canvas) => {
    const lats = route.map(point => point.lat);
    const lngs = route.map(point => point.lng);
    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);
    const width = maxLat === minLat ? 1 : maxLat - minLat;
    const height = maxLng === minLng ? 1 : maxLng - minLng;
    const padding = 20;
    const xScale = 500/width;
    const yScale = 500/height;
    const ctx = canvas.getContext('2d');
    canvas.width = 500 + 2*padding;
    canvas.height = 500 + 2*padding;
    for(let i = 1; i < route.length; i++) {
        const point1 = route[i-1]; 
        const point2 = route[i];
        const x1 = (point1.lng - minLng)*yScale + padding;
        const y1 = (point1.lat - minLat)*xScale + padding;
        const x2 = (point2.lng - minLng)*yScale + padding;
        const y2 = (point2.lat - minLat)*xScale + padding;
        drawLine(ctx, x1, y1, x2, y2);
        drawPoint(ctx, x1, y1, i === 1 ? `(${point1.lat.toFixed(2)}, ${point1.lng.toFixed(2)})` : "");
        if(i === route.length-1)
            drawPoint(ctx, x2, y2, `(${point2.lat.toFixed(2)}, ${point2.lng.toFixed(2)})`);
    };    
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