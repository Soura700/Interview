// import { Component, signal, OnInit } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.html',
//   imports: [FormsModule],
//   styleUrls: ['./login.css']
// })
// export class LoginComponent implements OnInit {

//   loading = signal(false);
//   errorMessage = signal<string | null>(null);
//   showPassword = signal(false);

//   credentials = {
//     email: '',
//     password: '',
//     role: ''
//   };

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     // Check if login page was opened because of blocked access
//     const isBlocked = this.router.url.includes('blocked=true');

//     // If NOT blocked, perform cookie-based redirect
//     if (!isBlocked && this.router.url === '/login') {
//       this.runCookieBasedRedirect();
//     }
//   }

//   // 🔥 Helper to detect true / 1 / "1"
//   isFirstLoginFlag(val: any): boolean {
//     return val === true || val === "true" || val === 1 || val === "1";
//   }

//   // =======================================================
//   // ⬇️ AUTO-REDIRECT BASED ON EXISTING COOKIE (ONLY IF NOT BLOCKED)
//   // =======================================================
//   runCookieBasedRedirect() {

//     // 1️⃣ ADMIN COOKIE CHECK
//     this.http.get("http://localhost:5147/api/admin/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/admin/dashboard']),
//       error: () => {}
//     });

//     // 2️⃣ INTERVIEWER COOKIE CHECK
//     this.http.get("http://localhost:5147/api/interviewer/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/interviewer/interviewer-dashboard']),
//       error: () => {}
//     });

//     // 3️⃣ CANDIDATE COOKIE CHECK
//     this.http.get("http://localhost:5147/api/candidate/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => {

//         // must fetch profile to check firstLogin
//         this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
//           withCredentials: true
//         }).subscribe({
//           next: (profile) => {

//             if (this.isFirstLoginFlag(profile.firstLogin)) {
//               // Candidate must change password before dashboard
//               this.router.navigate(['/changePassword'], {
//                 queryParams: { email: profile.email, role: 'Candidate' }
//               });
//               return;
//             }

//             // Normal redirect
//             this.router.navigate(['/candidate/candidate-dashboard']);
//           },
//           error: () => {}
//         });

//       },
//       error: () => {}
//     });
//   }

//   togglePasswordVisibility() {
//     this.showPassword.set(!this.showPassword());
//   }

//   // =======================================================
//   // ⭐ LOGIN SUBMIT
//   // =======================================================
//   onSubmit(form: NgForm) {
//     if (!form.valid) return;

//     this.loading.set(true);
//     this.errorMessage.set(null);

//     let apiUrl = '';

//     if (this.credentials.role === 'Admin') {
//       apiUrl = 'http://localhost:5147/api/admin/auth/login';
//     }
//     else if (this.credentials.role === 'Interviewer') {
//       apiUrl = 'http://localhost:5147/api/interviewer/auth/login';
//     }
//     else if (this.credentials.role === 'Candidate') {
//       apiUrl = 'http://localhost:5147/api/candidate/auth/login';
//     }
//     else {
//       alert('Please select a role');
//       this.loading.set(false);
//       return;
//     }

//     this.http.post(apiUrl, {
//       email: this.credentials.email,
//       password: this.credentials.password
//     }, {
//       withCredentials: true
//     })
//     .pipe(finalize(() => this.loading.set(false)))
//     .subscribe({
//       next: (res: any) => {

//         // FIRST LOGIN CHECK (Candidate + Interviewer)
//         if (this.isFirstLoginFlag(res.firstLogin)) {
//           this.router.navigate(['/changePassword'], {
//             queryParams: { email: this.credentials.email, role: this.credentials.role }
//           });
//           return;
//         }

//         // NORMAL REDIRECTS
//         if (this.credentials.role === 'Admin') {
//           this.router.navigate(['/admin/dashboard']);
//           return;
//         }

//         if (this.credentials.role === 'Interviewer') {
//           this.router.navigate(['/interviewer/interviewer-dashboard']);
//           return;
//         }

//         if (this.credentials.role === 'Candidate') {
//           this.router.navigate(['/candidate/candidate-dashboard']);
//           return;
//         }
//       },
//       error: (err) => {
//         this.errorMessage.set(err.error?.message || 'Invalid credentials');
//       }
//     });
//   }
// }


// import { Component, signal, OnInit } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.html',
//   imports: [FormsModule],
//   styleUrls: ['./login.css']
// })
// export class LoginComponent implements OnInit {

//   loading = signal(false);
//   errorMessage = signal<string | null>(null);
//   showPassword = signal(false);

//   credentials = {
//     email: '',
//     password: '',
//     role: ''
//   };

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {

//     const blocked = this.router.url.includes('blocked=true');

//     // RUN AUTO LOGIN ONLY IF NOT BLOCKED & on login page
//     if (!blocked && this.router.url === '/login') {
//       this.runCookieBasedRedirect();
//     }
//   }

//   // true / 1 / "1"
//   isFirstLoginFlag(v: any): boolean {
//     return v === 1 || v === "1" || v === true || v === "true";
//   }

//   // AUTO REDIRECT FROM COOKIE
//   runCookieBasedRedirect() {

//     // ADMIN
//     this.http.get("http://localhost:5147/api/admin/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/admin/dashboard']),
//       error: () => {}
//     });

//     // INTERVIEWER
//     this.http.get("http://localhost:5147/api/interviewer/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/interviewer/interviewer-dashboard']),
//       error: () => {}
//     });

//     // CANDIDATE
//     this.http.get("http://localhost:5147/api/candidate/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => {

//         this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
//           withCredentials: true
//         }).subscribe({
//           next: (profile) => {

//             // ⛔ DO NOT REDIRECT IF FIRST LOGIN
//             if (this.isFirstLoginFlag(profile.firstLogin)) {
//               // stay on login page only
//               return;
//             }

//             // otherwise redirect normally
//             this.router.navigate(['/candidate/candidate-dashboard']);
//           }
//         });

//       },
//       error: () => {}
//     });

//   }

//   togglePasswordVisibility() {
//     this.showPassword.set(!this.showPassword());
//   }

//   // SUBMIT LOGIN
//   onSubmit(form: NgForm) {
//     if (!form.valid) return;

//     this.loading.set(true);
//     this.errorMessage.set(null);

//     let apiUrl = '';

//     if (this.credentials.role === 'Admin') apiUrl = 'http://localhost:5147/api/admin/auth/login';
//     else if (this.credentials.role === 'Interviewer') apiUrl = 'http://localhost:5147/api/interviewer/auth/login';
//     else if (this.credentials.role === 'Candidate') apiUrl = 'http://localhost:5147/api/candidate/auth/login';
//     else {
//       alert('Please select a role');
//       this.loading.set(false);
//       return;
//     }

//     this.http.post(apiUrl, {
//       email: this.credentials.email,
//       password: this.credentials.password
//     }, {
//       withCredentials: true
//     })
//     .pipe(finalize(() => this.loading.set(false)))
//     .subscribe({
//       next: (res: any) => {

//         // FIRST LOGIN CASE
//         if (this.isFirstLoginFlag(res.firstLogin)) {
//           this.router.navigate(['/changePassword'], {
//             queryParams: { email: this.credentials.email, role: this.credentials.role }
//           });
//           return;
//         }

//         // NORMAL LOGIN FLOW
//         if (this.credentials.role === 'Admin') {
//           this.router.navigate(['/admin/dashboard']);
//           return;
//         }

//         if (this.credentials.role === 'Interviewer') {
//           this.router.navigate(['/interviewer/interviewer-dashboard']);
//           return;
//         }

//         if (this.credentials.role === 'Candidate') {
//           this.router.navigate(['/candidate/candidate-dashboard']);
//           return;
//         }

//       },
//       error: (err) => {
//         this.errorMessage.set(err.error?.message || 'Invalid credentials');
//       }
//     });

//   }
// }



// import { Component, signal, OnInit } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.html',
//   imports: [FormsModule],
//   styleUrls: ['./login.css']
// })
// export class LoginComponent implements OnInit {

//   loading = signal(false);
//   errorMessage = signal<string | null>(null);
//   showPassword = signal(false);

//   credentials = {
//     email: '',
//     password: '',
//     role: ''
//   };

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     const blocked = this.router.url.includes('blocked=true');

//     if (!blocked && this.router.url === '/login') {
//       this.runCookieBasedRedirect();
//     }
//   }

//   isFirstLoginFlag(v: any): boolean {
//     return v === 1 || v === "1" || v === true || v === "true";
//   }

//   runCookieBasedRedirect() {

//     // ADMIN
//     this.http.get("http://localhost:5147/api/admin/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/admin/dashboard']),
//       error: () => {}
//     });

//     // INTERVIEWER
//     this.http.get("http://localhost:5147/api/interviewer/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => this.router.navigate(['/interviewer/interviewer-dashboard']),
//       error: () => {}
//     });

//     // CANDIDATE
//     this.http.get("http://localhost:5147/api/candidate/secure/check", {
//       withCredentials: true
//     }).subscribe({
//       next: () => {
//         this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
//           withCredentials: true
//         }).subscribe({
//           next: (profile) => {

//             if (this.isFirstLoginFlag(profile.firstLogin)) {
//               return; // stay on login
//             }

//             this.router.navigate(['/candidate/candidate-dashboard']);
//           },
//           error: () => {}
//         });
//       },
//       error: () => {}
//     });
//   }

//   togglePasswordVisibility() {
//     this.showPassword.set(!this.showPassword());
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) return;

//     this.loading.set(true);
//     this.errorMessage.set(null);

//     let apiUrl = '';

//     if (this.credentials.role === 'Admin')
//       apiUrl = 'http://localhost:5147/api/admin/auth/login';

//     else if (this.credentials.role === 'Interviewer')
//       apiUrl = 'http://localhost:5147/api/interviewer/auth/login';

//     else if (this.credentials.role === 'Candidate')
//       apiUrl = 'http://localhost:5147/api/candidate/auth/login';

//     else {
//       alert('Please select a role');
//       this.loading.set(false);
//       return;
//     }

//     this.http.post(apiUrl, {
//       email: this.credentials.email,
//       password: this.credentials.password
//     }, { withCredentials: true })
//     .pipe(finalize(() => this.loading.set(false)))
//     .subscribe({
//       next: (res: any) => {

//         if (this.isFirstLoginFlag(res.firstLogin)) {
//           this.router.navigate(['/changePassword'], {
//             queryParams: { email: this.credentials.email, role: this.credentials.role }
//           });
//           return;
//         }

//         if (this.credentials.role === 'Admin')
//           this.router.navigate(['/admin/dashboard']);

//         if (this.credentials.role === 'Interviewer')
//           this.router.navigate(['/interviewer/interviewer-dashboard']);

//         if (this.credentials.role === 'Candidate')
//           this.router.navigate(['/candidate/candidate-dashboard']);
//       },
//       error: (err) => {
//         this.errorMessage.set(err.error?.message || 'Invalid credentials');
//       }
//     });

//   }
// }


import { Component, signal, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,

  templateUrl: './login.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  credentials = {
    email: '',
    password: '',
    role: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    const blocked = this.router.url.includes('blocked=true');

    if (!blocked && this.router.url === '/login') {
      this.runCookieBasedRedirect();
    }
  }

  isFirstLoginFlag(v: any): boolean {
    return v === 1 || v === "1" || v === true || v === "true";
  }

  runCookieBasedRedirect() {

    // ADMIN
    this.http.get("http://localhost:5147/api/admin/secure/check", {
      withCredentials: true
    }).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => { }
    });

    // INTERVIEWER
    this.http.get("http://localhost:5147/api/interviewer/secure/check", {
      withCredentials: true
    }).subscribe({
      next: () => this.router.navigate(['/interviewer/interviewer-dashboard']),
      error: () => { }
    });

    // CANDIDATE
    this.http.get("http://localhost:5147/api/candidate/secure/check", {
      withCredentials: true
    }).subscribe({
      next: () => {
        this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
          withCredentials: true
        }).subscribe({
          next: (profile) => {

            if (this.isFirstLoginFlag(profile.firstLogin)) {
              return; // stay on login
            }

            this.router.navigate(['/candidate/candidate-dashboard']);
          },
          error: () => { }
        });
      },
      error: () => { }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    let apiUrl = '';

    if (this.credentials.role === 'Admin')
      apiUrl = 'http://localhost:5147/api/admin/auth/login';

    else if (this.credentials.role === 'Interviewer')
      apiUrl = 'http://localhost:5147/api/interviewer/auth/login';

    else if (this.credentials.role === 'Candidate')
      apiUrl = 'http://localhost:5147/api/candidate/auth/login';

    else {
      alert('Please select a role');
      this.loading.set(false);
      return;
    }

    this.http.post(apiUrl, {
      email: this.credentials.email,
      password: this.credentials.password
    }, { withCredentials: true })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {

          if (this.isFirstLoginFlag(res.firstLogin)) {
            this.router.navigate(['/changePassword'], {
              queryParams: { email: this.credentials.email, role: this.credentials.role }
            });
            return;
          }

          if (this.credentials.role === 'Admin')
            this.router.navigate(['/admin/dashboard']);

          if (this.credentials.role === 'Interviewer')
            this.router.navigate(['/interviewer/interviewer-dashboard']);

          if (this.credentials.role === 'Candidate')
            this.router.navigate(['/candidate/candidate-dashboard']);
        },
        error: (err) => {
          console.log("FULL ERROR:", err);

          const msg = err?.error?.message || 'Invalid credentials';
          this.errorMessage.set(msg);   // <-- This will show in your UI div
        }

      });

  }
}