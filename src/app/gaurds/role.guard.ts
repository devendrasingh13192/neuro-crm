import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const roleGuard = (allowedRoles : string[]) : CanActivateFn => () : boolean | UrlTree | Observable<boolean
| UrlTree> | Promise<boolean | UrlTree> => {
    const router = inject(Router)
    const authService = inject(AuthService);
    const user = authService.user$();
    const hasAccess = user && allowedRoles.includes(user.role);
    return hasAccess ? true : router.createUrlTree(['/dashboard']);
  }
