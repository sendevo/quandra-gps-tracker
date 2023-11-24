<img src="images/quandra-banner.png" width="50%" style="margin-bottom: 50px"/>

# Quandra Logger App

Aplicación móvil para el registro de rutas vehiculares. Esta aplicación forma parte del proyecto Quandra, es de propósito general y permite exportar los datos de viaje via POST http indicando la URL de una API RESTful compatible.  

El proyecto Quandra posee una API que permite registrar las rutas en su base de datos y luego, mediante combinación de datos de múltiples recorridos por ciertas rutas, la API de Quandra puede computar escalas de transitabilidad de las mismas.

## Formato

Esta aplicación registra las rutas en una base de datos local (indexedDB) con los siguientes campos: 

```jsonc
{
    "syncID": "", // Identificador UUID v4 (creado por la API RESTful)
    "created": 0, // Estampa de tiempo de finalizacion de la grabación de ruta
    "route": [], // Datos de ruta en formato {time, lat, lng}
    "distance": 0, // Distancia total en km
    "elapsed": 0 // Tiempo de viaje en ms
}
```

La API de Quandra recibe datos de viaje en formato CSV (tiempo, latitud, longitud), por lo que esta app respeta la misma convención para el envío de datos de viaje, por ejemplo:

```
2023-01-01T12:00:00,40.748817,-73.985428
2023-01-01T12:15:00,40.748184,-73.986409
2023-01-01T12:30:00,40.747494,-73.987555
2023-01-01T12:45:00,40.756001,-73.989292
2023-01-01T13:00:00,40.755521,-73.990295
2023-01-01T13:15:00,40.759159,-73.992987
2023-01-01T13:30:00,40.758301,-73.991101
2023-01-01T13:45:00,40.757389,-73.990215
2023-01-01T14:00:00,40.756482,-73.989330
...
```
Los registros son anónimos y si la sincronización fue exitosa, la API responde con un identificador (UUID v4), el cual se asociará a la ruta correspondiente (para operaciones que aún no están implementadas).

## Instalación

1.- Descargar repo e instalar dependencias
```bash
git clone https://github.com/sendevo/quandra-logger-app.git
cd quandra-logger-app
npm install
npm run build
```

2.- Ejecución en navegador local
```bash
npm run dev
```

3.- Compilación a proyecto Android-Studio
```bash
npx cap add android
npx cap sync
cp ./images/drawable ./android/app/src/main/res
npx cap open android
```