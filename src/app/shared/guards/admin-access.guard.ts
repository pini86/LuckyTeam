import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const adminAccessGuard: CanActivateFn = (): boolean | UrlTree => {
  const userName: string = localStorage.getItem('username');

  if (userName === 'admin@admin.com') {
    return true;
  }

  return inject(Router).createUrlTree(['/signin']);
};
