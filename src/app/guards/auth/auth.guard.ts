import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  if (auth.isAuthenticated()) {
    return true
  } else {
    router.navigate(['/login'])
    return false
  };
};

export const authGuard2: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  if (auth.isAuthenticated()) {
    router.navigate(['/chat'])
    return false
  } else {
    return true
  };
};
