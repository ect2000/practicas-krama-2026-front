import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Recuperamos el usuario del localStorage (donde guardas la sesión)
  const usuarioStr = localStorage.getItem('usuarioLogueado');
  
  if (usuarioStr) {
    const usuario = JSON.parse(usuarioStr);
    
    // Verificamos si el rol es exactamente ADMIN
    if (usuario.rol === 'ADMIN') {
      return true; // Acceso permitido
    }
  }

  // Si no es admin, lo mandamos a la página de inicio
  console.warn('Acceso denegado: Se requiere rol de Administrador');
  router.navigate(['/inicio']);
  return false;
};