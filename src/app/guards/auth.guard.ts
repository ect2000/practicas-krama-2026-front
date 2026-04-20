import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // CORRECCIÓN: Usamos 'usuarioLogueado', que es tu clave real
  const usuario = localStorage.getItem('usuarioLogueado'); 

  if (usuario) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioStr = localStorage.getItem('usuarioLogueado');

  if (usuarioStr) {
    const usuario = JSON.parse(usuarioStr);
    if (usuario.rol === 'ADMIN' || usuario.rol === 'ADMINISTRADOR') {
      return true; 
    }
  }
  
  router.navigate(['/inicio']);
  return false;
};