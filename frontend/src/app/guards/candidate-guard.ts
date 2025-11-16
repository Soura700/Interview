// import { inject } from '@angular/core';
// import { Router, CanActivateFn } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, of } from 'rxjs';

// export const candidateGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const http = inject(HttpClient);

//   return http.get("http://localhost:5147/api/candidate/secure/check", {
//     withCredentials: true,
//     headers: { "X-Auth-Type": "Candidate" }
//   }).pipe(
//     map(() => true), 
//     catchError(() => {
//       router.navigate(['/login']);
//       return of(false);
//     })
//   );
// };


import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

export const candidateGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return http.get("http://localhost:5147/api/candidate/secure/check", {
    withCredentials: true
  }).pipe(
    switchMap(() =>
      http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
        withCredentials: true
      })
    ),
    map(profile => {
      if (profile.firstLogin == 1) {
        router.navigate(['/changePassword'], {
          queryParams: { email: profile.email, role: 'Candidate' }
        });
        return false;
      }

      return true;
    }),
    catchError(() => {
      router.navigate(['/login'])
      return of(false);
    })
  );
};
