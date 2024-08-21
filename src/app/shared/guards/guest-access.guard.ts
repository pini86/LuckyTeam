import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const guestAccessGuard: CanActivateFn = (): boolean | UrlTree => {
  const token: string = localStorage.getItem('token');

  if (token) {
    return inject(Router).createUrlTree(['']);
  }

  return true;
};
