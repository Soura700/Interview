// // nEW gAURD 

// import { inject } from '@angular/core';
// import { Router, CanActivateFn } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, of } from 'rxjs';

// export const authGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const http = inject(HttpClient);

//   return http.get("http://localhost:5147/api/admin/secure/check", {
//     withCredentials: true,  // send cookie automatically
//     headers: { "X-Auth-Type": "Admin" }
//   }).pipe(
//     map(() => true),         // Backend says OK → allow route
//     catchError(() => {
//       router.navigate(['/login'], { queryParams: { blocked: true } });
//       return of(false);
//     })
//   );
// };

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return http.get("http://localhost:5147/api/admin/secure/check", {
    withCredentials: true
  }).pipe(
    map(() => true),
    catchError(() => {

      // ❗ Only redirect if user is trying to access ADMIN pages
      if (state.url.startsWith('/admin')) {
        router.navigate(['/login']);
      }

      return of(false);
    })
  );
};



