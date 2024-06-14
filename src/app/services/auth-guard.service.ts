import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const currentUser = userService.userValue;

  if (currentUser) {
    router.navigate(['/']);
    toastr.info('You are already logged in', 'Info');
    return false;
  }

  return true;
};
