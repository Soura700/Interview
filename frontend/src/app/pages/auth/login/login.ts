// import { Component, signal } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.html',
//   imports: [FormsModule],
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {

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
//     private router: Router,
//     private cookieService: CookieService
//   ) {
//     this.redirectIfLoggedIn();   // AUTO-REDIRECT CHECK
//   }

//   // -------------------------------------
//   // IF COOKIE EXISTS → GO TO HELLO
//   // -------------------------------------
//   redirectIfLoggedIn() {
//     const token = this.cookieService.get('admin_token');

//     if (token && token.trim() !== '') {
//       console.log("Cookie found → redirect to /hello");
//       this.router.navigate(['/admin/dashboard']);
//     }
//   }

//   togglePasswordVisibility() {
//     this.showPassword.set(!this.showPassword());
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) return;

//     this.loading.set(true);
//     this.errorMessage.set(null);

//     let apiUrl = '';

//     // -------------------------------------
//     // SELECT APPROPRIATE LOGIN API
//     // -------------------------------------
//     if (this.credentials.role === 'Interviewer') {
//       apiUrl = 'http://localhost:5147/api/Interviewer/login';

//     } else if (this.credentials.role === 'Candidate') {
//       apiUrl = 'http://localhost:5147/api/Candidate/login';

//     } else if (this.credentials.role === 'Admin') {
//       apiUrl = 'http://localhost:5147/api/admin/auth/login';

//     } else {
//       alert('Please select a role');
//       this.loading.set(false);
//       return;
//     }

//     this.http.post(
//       apiUrl,
//       {
//         email: this.credentials.email,
//         password: this.credentials.password
//       },
//       {
//         withCredentials: true   // STORE COOKIE
//       }
//     )
//     .pipe(finalize(() => this.loading.set(false)))
//     .subscribe({
//       next: (res: any) => {

//         // -------------------------------------
//         // ADMIN LOGIN SUCCESS — COOKIE SET
//         // -------------------------------------
//         if (this.credentials.role === 'Admin') {
//           alert('Admin Login Successful!');
//           this.router.navigate(['/hello']);
//           form.resetForm();
//           return;
//         }

//         // -------------------------------------
//         // Candidate / Interviewer Logic
//         // -------------------------------------
//         if (res.firstLogin === true || res.firstLogin === 1 || res.firstLogin === '1') {
//           alert('⚠️ First-time login. Please change your password.');
//           this.router.navigate(['/changePassword'], {
//             queryParams: {
//               email: this.credentials.email,
//               role: this.credentials.role
//             }
//           });
//         } else {
//           alert('Login successful!');
//           if (this.credentials.role === 'Interviewer') {
//             this.router.navigate(['/interviewer-dashboard']);
//           } else {
//             this.router.navigate(['/candidate-dashboard']);
//           }
//         }

//         form.resetForm();
//       },
//       error: (err) => {
//         this.errorMessage.set(err.error?.message || 'Invalid credentials!');
//       }
//     });
//   }
// }

import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [FormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {

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
  ) {
    this.redirectIfLoggedIn();
  }

  // 🔥 SECURE AUTO-REDIRECT
  redirectIfLoggedIn() {
    this.http.get("http://localhost:5147/api/admin/secure/check", {
      withCredentials: true
    }).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {}
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

    if (this.credentials.role === 'Admin') {
      apiUrl = 'http://localhost:5147/api/admin/auth/login';
    }
    else if (this.credentials.role === 'Interviewer') {
      apiUrl = 'http://localhost:5147/api/Interviewer/login';
    }
    else if (this.credentials.role === 'Candidate') {
      apiUrl = 'http://localhost:5147/api/Candidate/login';
    }
    else {
      alert('Please select a role');
      this.loading.set(false);
      return;
    }

    this.http.post(apiUrl, {
      email: this.credentials.email,
      password: this.credentials.password
    }, {
      withCredentials: true     // browser stores JWT cookie ( Hacker can't tamper the cookie)
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: () => {
        if (this.credentials.role === 'Admin') {
          alert('Admin Login Successful');
          this.router.navigate(['/admin/dashboard']);
          form.resetForm();
          return;
        }

        alert('Login successful!');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid credentials');
      }
    });
  }
}
