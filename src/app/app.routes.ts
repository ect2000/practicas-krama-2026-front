import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    // Cuando el usuario entra a la app sin ninguna ruta (ej. localhost:8100)
    path: '',
    redirectTo: 'login', // Lo redirigimos automáticamente a nuestra página de Inicio
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then( m => m.InicioPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'estimaciones',
    loadComponent: () => import('./estimaciones/estimaciones.page').then( m => m.EstimacionesPage),
    canActivate: [authGuard]
  },
  {
    path: 'acerca',
    loadComponent: () => import('./acerca/acerca.page').then( m => m.AcercaPage),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [authGuard]
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./proyectos/proyectos.page').then( m => m.ProyectosPage),
    // ---> AÑADIMOS EL ADMINGUARD <---
    canActivate: [authGuard, adminGuard] 
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./ajustes/ajustes.page').then( m => m.AjustesPage),
    canActivate: [authGuard]
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./notificaciones/notificaciones.page').then( m => m.NotificacionesPage),
    // ---> AÑADIMOS EL ADMINGUARD <---
    canActivate: [authGuard, adminGuard] 
  },
  {
    path: 'informes',
    loadComponent: () => import('./informes/informes.page').then( m => m.InformesPage),
    canActivate: [authGuard]
  },
  {
    path: 'clientes',
    loadComponent: () => import('./clientes/clientes.page').then( m => m.ClientesPage),
    // ---> AÑADIMOS EL ADMINGUARD <---
    canActivate: [authGuard, adminGuard] 
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.page').then( m => m.UsuariosPage),
    // ---> AÑADIMOS EL ADMINGUARD <---
    canActivate: [authGuard, adminGuard] 
  },
  {
    path: 'cambiar-password',
    loadComponent: () => import('./cambiar-password/cambiar-password.page').then( m => m.CambiarPasswordPage),
    canActivate: [authGuard]
  },
];