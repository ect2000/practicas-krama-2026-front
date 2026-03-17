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
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'estimaciones',
    loadComponent: () => import('./estimaciones/estimaciones.page').then( m => m.EstimacionesPage)
  },
  {
    path: 'proyecto-detalle',
    loadComponent: () => import('./proyecto-detalle/proyecto-detalle.page').then( m => m.ProyectoDetallePage)
  },
  {
    path: 'imputar',
    loadComponent: () => import('./imputar/imputar.page').then( m => m.ImputarPage)
  },
  {
    path: 'acerca',
    loadComponent: () => import('./acerca/acerca.page').then( m => m.AcercaPage)
  },
  // Aquí, al usar el comando de Ionic para crear páginas,
  // añadirá automáticamente las nuevas rutas para 'inicio', 'perfil' y 'configuracion'.
];