import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(catchError(err => {
    if ([401].includes(err.status)) {
      console.error('🚨: Показать ошибку авторизации!');
    }
    const error = err.error?.message || err.statusText;
    return throwError(() => error);
  }));
}
