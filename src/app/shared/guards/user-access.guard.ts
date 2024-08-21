import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const userAccessGuard: CanActivateFn = (): boolean | UrlTree => {
  const token: string = localStorage.getItem('token');

  if (token) {
    return true;
  }

  return inject(Router).createUrlTree(['/signin']);
};
