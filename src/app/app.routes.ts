import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Cuando el usuario entra a la app sin ninguna ruta (ej. localhost:8100)
    path: '',
    redirectTo: 'login', // Lo redirigimos automáticamente a nuestra página de Inicio
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
    path: 'imputar',
    loadComponent: () => import('./imputar/imputar.page').then( m => m.ImputarPage)
  },
  {
    path: 'acerca',
    loadComponent: () => import('./acerca/acerca.page').then( m => m.AcercaPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./proyectos/proyectos.page').then( m => m.ProyectosPage)
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./ajustes/ajustes.page').then( m => m.AjustesPage)
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./notificaciones/notificaciones.page').then( m => m.NotificacionesPage)
  },
  {
    path: 'informes',
    loadComponent: () => import('./informes/informes.page').then( m => m.InformesPage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./clientes/clientes.page').then( m => m.ClientesPage)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.page').then( m => m.UsuariosPage)
  },  {
    path: 'cambiar-password',
    loadComponent: () => import('./cambiar-password/cambiar-password.page').then( m => m.CambiarPasswordPage)
  },


  

  // Aquí, al usar el comando de Ionic para crear páginas,
  // añadirá automáticamente las nuevas rutas para 'inicio', 'perfil' y 'configuracion'.
];