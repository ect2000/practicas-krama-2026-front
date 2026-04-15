import { HttpInterceptorFn } from '@angular/common/http';

// FÍJATE EN ESTE 'export' DE AQUÍ ABAJO:
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token_krama');

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