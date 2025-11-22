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
  images = [
  'https://img.freepik.com/free-vector/letter-concept-illustration_114360-4092.jpg?semt=ais_hybrid&w=740',
  'https://media.istockphoto.com/id/1298159225/vector/broadcasting-with-journalist-or-newscaster.jpg?s=612x612&w=0&k=20&c=RYq-yNo6t3K2p761AUOgrT284CUdIB7XKgn2ppL6608='
];
currentIndex = 0;

  credentials = {
    email: '',
    password: '',
    role: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // ngOnInit() {
  //   const blocked = this.router.url.includes('blocked=true');

  //   if (!blocked && this.router.url === '/login') {
  //     this.runCookieBasedRedirect();
  //   }
    
  // }
  ngOnInit() {
  const blocked = this.router.url.includes('blocked=true');

  if (!blocked && this.router.url === '/login') {
    this.runCookieBasedRedirect();
  }

  // 🔵 Image slider logic (safe, no interference)
  this.images = [
    'https://img.freepik.com/free-vector/letter-concept-illustration_114360-4092.jpg?semt=ais_hybrid&w=740',
    'https://media.istockphoto.com/id/1298159225/vector/broadcasting-with-journalist-or-newscaster.jpg?s=612x612&w=0&k=20&c=RYq-yNo6t3K2p761AUOgrT284CUdIB7XKgn2ppL6608='
  ];

  setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }, 5);
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