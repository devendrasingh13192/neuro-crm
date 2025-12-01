import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) : boolean | UrlTree | Observable<boolean
| UrlTree> | Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() 
    ? true 
    : router.createUrlTree(['/login']);
};
