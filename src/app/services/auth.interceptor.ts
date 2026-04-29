import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // SOLUCIÓN: Cambiamos 'token_krama' por 'token' para que coincida con tu memoria
  const token = localStorage.getItem('token');

  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(peticionClonada); 
  }

  return next(req);
};