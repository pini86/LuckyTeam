import {CanActivateFn, Router, UrlTree} from "@angular/router";
import {inject} from "@angular/core";

export const guestAccessGuard: CanActivateFn = (): boolean | UrlTree => {
  const token: string = localStorage.getItem('token');

  if (token) {
    return inject(Router).createUrlTree(['']);
  }

  return true;
}
