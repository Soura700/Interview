// // import { Component, signal } from '@angular/core';
// // import { FormsModule, NgForm } from '@angular/forms';
// // import { HttpClient } from '@angular/common/http';
// // import { finalize } from 'rxjs/operators';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-login',
// //   templateUrl: './login.html',
// //   imports: [FormsModule],
// //   styleUrls: ['./login.css']
// // })
// // export class LoginComponent {
// //   loading = signal(false);
// //   errorMessage = signal<string | null>(null);
// //   showPassword = signal(false); // password toggler

// //   credentials = {
// //     email: '',
// //     password: '',
// //     role: '' // Candidate or Interviewer
// //   };

// //   constructor(private http: HttpClient, private router: Router) { }

// //   togglePasswordVisibility() {
// //     this.showPassword.set(!this.showPassword());
// //   }

// //   onSubmit(form: NgForm) {
// //     if (!form.valid) return;

// //     this.loading.set(true);
// //     this.errorMessage.set(null);

// //     let apiUrl = '';
// //     if (this.credentials.role === 'Interviewer') {
// //       apiUrl = 'http://localhost:5147/api/Interviewer/login';
// //     } else if (this.credentials.role === 'Candidate') {
// //       apiUrl = 'http://localhost:5147/api/Candidate/login';
// //     } else {
// //       alert('⚠️ Please select a role');
// //       this.loading.set(false);
// //       return;
// //     }

// //     this.http
// //       .post(apiUrl, {
// //         email: this.credentials.email,
// //         password: this.credentials.password
// //       })
// //       .pipe(finalize(() => this.loading.set(false)))
// //       .subscribe({
// //         next: (res: any) => {
// //           console.log('Login response:', res);

// //           // ✅ Check firstLogin flag
// //           if (res.firstLogin) {
// //             alert('⚠️ First-time login. Please change your password.');
// //             this.router.navigate(['/change-password'], {
// //               queryParams: {
// //                 email: this.credentials.email,
// //                 role: this.credentials.role
// //               }
// //             });
// //           } else {
// //             alert('✅ Login successful!');
// //             if (this.credentials.role === 'Interviewer') {
// //               this.router.navigate(['/interviewer-dashboard']);
// //             } else {
// //               this.router.navigate(['/candidate-dashboard']);
// //             }
// //           }

// //           form.resetForm();
// //         },
// //         error: (err) => {
// //           this.errorMessage.set(err.error?.message || '❌ Invalid credentials!');
// //         }
// //       });
// //   }
// // }



// import { Component, signal } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.html',
//   imports: [FormsModule],
//   styleUrls: ['./login.css']
// })
// export class LoginComponent {
//   loading = signal(false);
//   errorMessage = signal<string | null>(null);
//   showPassword = signal(false); // 👈 password visibility toggle

//   credentials = {
//     email: '',
//     password: '',
//     role: '' // Candidate or Interviewer
//   };

//   constructor(private http: HttpClient, private router: Router) {}

//   togglePasswordVisibility() {
//     this.showPassword.set(!this.showPassword());
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) return;

//     this.loading.set(true);
//     this.errorMessage.set(null);

//     let apiUrl = '';
//     if (this.credentials.role === 'Interviewer') {
//       apiUrl = 'http://localhost:5147/api/Interviewer/login';
//     } else if (this.credentials.role === 'Candidate') {
//       apiUrl = 'http://localhost:5147/api/Candidate/login';
//     } else {
//       alert('⚠️ Please select a role');
//       this.loading.set(false);
//       return;
//     }

//     this.http
//       .post(apiUrl, {
//         email: this.credentials.email,
//         password: this.credentials.password
//       })
//       .pipe(finalize(() => this.loading.set(false)))
//       .subscribe({
//         next: (res: any) => {
//           console.log('Login response:', res);

//           if (res.firstLogin) {
//             alert('⚠️ First-time login. Please change your password.');
//             this.router.navigate(['/change-password'], {
//               queryParams: {
//                 email: this.credentials.email,
//                 role: this.credentials.role
//               }
//             });
//           } else {
//             alert('✅ Login successful!');
//             if (this.credentials.role === 'Interviewer') {
//               this.router.navigate(['/interviewer-dashboard']);
//             } else {
//               this.router.navigate(['/candidate-dashboard']);
//             }
//           }

//           form.resetForm();
//         },
//         error: (err) => {
//           this.errorMessage.set(err.error?.message || '❌ Invalid credentials!');
//         }
//       });
//   }
// }



import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // ✅ Signals for reactive state
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  // ✅ Login credentials model
  credentials = {
    email: '',
    password: '',
    role: '' // Candidate or Interviewer
  };

  constructor(private http: HttpClient, private router: Router) {}

  // 👁️ Toggle Password Visibility
  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  // 🚀 Login Submit Handler
  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    let apiUrl = '';
    if (this.credentials.role === 'Interviewer') {
      apiUrl = 'http://localhost:5147/api/Interviewer/login';
    } else if (this.credentials.role === 'Candidate') {
      apiUrl = 'http://localhost:5147/api/Candidate/login';
    } else {
      alert('⚠️ Please select a role');
      this.loading.set(false);
      return;
    }

    this.http
      .post(apiUrl, {
        email: this.credentials.email,
        password: this.credentials.password
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          console.log('Login response:', res);
          console.log('Type of firstLogin:', typeof res.firstLogin);
          alert(`firstLogin value: ${res.firstLogin}, type: ${typeof res.firstLogin}`);

          // ✅ Type-safe check for FirstLogin (works for true, 1, or "1")
          if (res.firstLogin === true || res.firstLogin === 1 || res.firstLogin === '1') {
            alert('⚠️ First-time login. Please change your password.');
            this.router.navigate(['/changePassword'], {
              queryParams: {
                email: this.credentials.email,
                role: this.credentials.role
              }
            });
          } else {
            alert('✅ Login successful!');
            if (this.credentials.role === 'Interviewer') {
              this.router.navigate(['/interviewer-dashboard']);
            } else {
              this.router.navigate(['/candidate-dashboard']);
            }
          }

          form.resetForm();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || '❌ Invalid credentials!');
        }
      });
  }
}
