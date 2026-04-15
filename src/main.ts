import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// 1. Añadimos withInterceptors a la importación
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
// 2. Importamos nuestro nuevo interceptor 
// (NOTA: Si guardaste el archivo dentro de la carpeta 'services', cambia 'interceptors' por 'services' en esta ruta)
import { authInterceptor } from './app/services/auth.interceptor';
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // 3. Activamos la herramienta HTTP, pero ahora le decimos que SIEMPRE pase por nuestro interceptor
    provideHttpClient(withInterceptors([authInterceptor])), 
  ],
});