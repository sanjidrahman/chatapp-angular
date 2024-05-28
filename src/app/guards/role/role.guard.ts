import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token')
  if (token) {
    const decode: any = jwtDecode(token)
    if (decode.payload.role == 'user') {
      // allow user to access particular route
      return true
    } else {
      // if not user it will be admin so redirect to admin routes
      return false
    }
  }
  return false
};
