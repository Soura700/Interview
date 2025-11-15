// import { inject } from '@angular/core';
// import { Router, CanActivateFn } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';

// export const authGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const cookieService = inject(CookieService);

//   const token = cookieService.get('admin_token');

//   if (token && token.trim() !== '') {
//     return true; // cookie exists → allow page
//   }

//   // no cookie → redirect to login
//   router.navigate(['/login']);
//   return false;
// };



// nEW gAURD 

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return http.get("http://localhost:5147/api/admin/secure/check", {
    withCredentials: true  // send cookie automatically
  }).pipe(
    map(() => true),         // Backend says OK → allow route
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

