import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = localStorage.getItem('token');

  if (token) {
    router.navigate(['/']);
    toastr.info('You are already logged in', 'Info');
    return false;
  }

  return true;
};

export const requireAuthGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = localStorage.getItem('token');

  if (!token) {
    userService.saveRedirectUrl(state.url);
    router.navigate(['/login']);
    toastr.warning('Please log in to access this page', 'Warning');
    return false;
  }

  return true;
};
