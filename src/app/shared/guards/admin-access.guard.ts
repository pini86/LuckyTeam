import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {inject} from "@angular/core";

export const adminAccessGuard: CanActivateFn = (): boolean | UrlTree => {
  const userName: string = localStorage.getItem('username');

  if (userName === 'admin@admin.com') {
    return true;
  }

  return inject(Router).createUrlTree(['/signin']);
}
