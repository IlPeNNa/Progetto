import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clona la richiesta e aggiunge headers se necessario
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestisce errori globali
      if (error.status === 401) {
        // Unauthorized - redirect to login
        localStorage.clear();
        router.navigate(['/login']);
      } /*else if (error.status === 0) {
        // Errore di rete - server non raggiungibile
        console.error('Server non raggiungibile. Controlla la connessione di rete.');
      }*/
      
      return throwError(() => error);
    })
  );
};
