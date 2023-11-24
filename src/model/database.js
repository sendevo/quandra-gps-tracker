import { DB_NAME, DB_VERSION } from "./constants";
import schema from "./schema.json";

export default class LocalDatabase {
    constructor() {
        this._db = null;
        this.onReady = []; // List of callbacks

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            this._db = event.target.result;
            Object.keys(schema).forEach(key => {
                const store = this._db.createObjectStore(key, schema[key].options);
                if (schema[key].indexes)
                    schema[key].indexes.forEach(index => store.createIndex(index.name, index.keyPath, index.options));
            });
        };

        request.onsuccess = event => {
            this._db = event.target.result;
            this._db.onerror = err => console.log(err, "error");
            console.log("DB initilized");
            this.onReady.forEach(callback => callback())
        };

        request.onerror = event => console.log(event.target.error, "error");
    }

    _performTransaction(callback) {
        console.log(`DB callback stack len: ${this.onReady.length}`);
        if (this._db)
            callback();
        else 
            this.onReady.push(callback);
    };

    addTravel(data) {
        return new Promise((resolve, reject) => {
            this._performTransaction( () => {
                const request = this._db
                    .transaction("travels", "readwrite")
                    .objectStore("travels")
                    .put(data);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getTravel(travelId) {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const request = this._db
                    .transaction("travels", "readonly")
                    .objectStore("travels")
                    .get(travelId);
                request.onsuccess = event => {
                    const travel = event.target.result;
                    if (travel) resolve(travel);
                    else reject(`Item with ID ${travelId} not found`);
                };
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    removeTravel(travelId) {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const request = this._db
                    .transaction("travels", "readwrite")
                    .objectStore("travels")
                    .delete(travelId);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getAllTravels() {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const request = this._db
                    .transaction("travels", "readonly")
                    .objectStore("travels")
                    .getAll();
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getTravelsPage(page, count) {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const lowerBound = (page - 1) * count;
                const upperBound = page * count;
                const keyRange = IDBKeyRange.bound(lowerBound, upperBound, false, false);
                const data = [];
                const request = this._db
                    .transaction("travels", "readonly")
                    .objectStore("travels")
                    .openCursor(keyRange);
                request.onsuccess = event => {
                    const cursor = event.target.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(data);
                    }
                };
                request.onerror = event => reject(event.target.error);
            });
        });
    }
}