
// import { inject } from '@angular/core';
// import { Router, CanActivateFn } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, of, switchMap } from 'rxjs';

// export const interviewerGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const http = inject(HttpClient);

//   return http.get("http://localhost:5147/api/interviewer/secure/check", {
//     withCredentials: true
//   }).pipe(
//     switchMap(() =>
//       http.get<any>("http://localhost:5147/api/interviewer/secure/profile", {
//         withCredentials: true
//       })
//     ),
//     map(profile => {
//       if (profile.firstLogin == 1) {
//         router.navigate(['/changePassword'], {
//           queryParams: { email: profile.email, role: 'Interviewer' }
//         });
//         return false;
//       }

//       return true;
//     }),
//     catchError(() => {
//       router.navigate(['/login'])
//       return of(false);
//     })
//   );
// };


import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';

export const interviewerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return http.get("http://localhost:5147/api/interviewer/secure/check", {
    withCredentials: true
  }).pipe(
    switchMap(() =>
      http.get<any>("http://localhost:5147/api/interviewer/secure/profile", {
        withCredentials: true
      })
    ),
    map(profile => {
      if (profile.firstLogin == 1) {
        router.navigate(['/changePassword'], {
          queryParams: { email: profile.email, role: 'Interviewer' }
        });
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login'])
        // , { queryParams: { blocked: true }});
      return of(false);
    })
  );
};
