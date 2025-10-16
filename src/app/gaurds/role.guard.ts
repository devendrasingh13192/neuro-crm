import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles : string[]) : CanActivateFn => {
  return () => {
    const router = inject(Router)
    const authService = inject(AuthService);
    const user = authService.user$();
    if(user && allowedRoles.includes(user.role)){
      return true;
    }else{
      router.navigate(['/dashboard']);
      return false;
    }
  }
}