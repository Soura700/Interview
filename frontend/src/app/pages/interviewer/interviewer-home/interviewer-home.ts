// import { Component, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-interviewer-home',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './interviewer-home.html',
//   styleUrl: './interviewer-home.css'
// })
// export class InterviewerHome implements OnInit {

//   loading = signal(false);
//   errorMessage = signal<string | null>(null);

//   fullName = signal('');
//   email = signal('');
//   experienceYears = signal(0);
//   skillSet = signal('');
//   interviewLevel = signal('');
//   resumeUrl = signal<string | null>(null);

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchProfile();
//   }

//   fetchProfile() {
//     const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

//     if (!email) {
//       this.errorMessage.set("User email not found. Please login again.");
//       return;
//     }

//     this.loading.set(true);

//     this.http.get<any>('http://localhost:5147/api/interviewer/secure/profile', {
//       params: { email }
//     }).subscribe(
//       (res) => {
//         this.fullName.set(res.fullName);
//         this.email.set(res.email);
//         this.experienceYears.set(res.experienceYears);
//         this.skillSet.set(res.skillSet);
//         this.interviewLevel.set(res.interviewLevel);
//         this.loading.set(false);
//       },
//       (err) => {
//         this.errorMessage.set("Failed to load interviewer profile.");
//         this.loading.set(false);
//       }
//     );
//   }
// }

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interviewer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interviewer-home.html',
  styleUrl: './interviewer-home.css'
})
export class InterviewerHome implements OnInit {

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  fullName = signal('');
  email = signal('');
  experienceYears = signal(0);
  skillSet = signal('');
  interviewLevel = signal('');
  firstLogin = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading.set(true);

    this.http.get<any>('http://localhost:5147/api/interviewer/secure/profile', {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.fullName.set(res.fullName);
        this.email.set(res.email);
        this.experienceYears.set(res.experienceYears);
        this.skillSet.set(res.skillSet);
        this.interviewLevel.set(res.interviewLevel);
        this.firstLogin.set(res.firstLogin);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Failed to load interviewer profile.");
        this.loading.set(false);
      }
    });
  }
}
