import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Cuando el usuario entra a la app sin ninguna ruta (ej. localhost:8100)
    path: '',
    redirectTo: 'inicio', // Lo redirigimos automáticamente a nuestra página de Inicio
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage)
  },
  // Aquí, al usar el comando de Ionic para crear páginas,
  // añadirá automáticamente las nuevas rutas para 'inicio', 'perfil' y 'configuracion'.
];