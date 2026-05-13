// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// src/environments/environment.ts
export const environment = {
  production: false,
  // URL de tu backend Spring Boot local. 
  // Recuerda: si vas a usar el emulador de Android, cambia 'localhost' por '10.0.2.2'
  // Si vas a usar un móvil físico, pon la IP de tu ordenador en la red WiFi (ej. '192.168.1.X')
  //apiUrl: 'http://10.0.2.2:8080' 
  apiUrl: 'http://localhost:8080'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
