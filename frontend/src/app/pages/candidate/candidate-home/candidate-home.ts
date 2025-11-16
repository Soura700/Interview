import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css'
})
export class CandidateHome implements OnInit {
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  fullName = signal('');
  email = signal('');
  experienceYears = signal(0);
  skillSet = signal('');
  resumeUrl = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchProfile();
  }

  // fetchProfile() {
  //   this.loading.set(true);
  //   this.errorMessage.set(null);

  //   const email = localStorage.getItem('userEmail');  // 👈 Retrieve logged-in email

  //   this.http.get<any>('http://localhost:5147/api/Candidate/profile', {
  //       params: { email: email || '' }
  //   })
  //   .subscribe(
  //     (res) => {
  //       this.fullName.set(res.fullName || '');
  //       this.email.set(res.email || '');
  //       this.experienceYears.set(res.experienceYears ?? 0);
  //       this.skillSet.set(res.skillSet || '');
  //       this.resumeUrl.set(res.resumePath || null);
  //       this.loading.set(false);
  //     },
  //     (err) => {
  //       this.errorMessage.set('Failed to load candidate profile.');
  //       this.loading.set(false);
  //     }
  //   );

  // }


  fetchProfile() {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
      withCredentials: true
    })
      .subscribe({
        next: res => {
          this.fullName.set(res.fullName || "");
          this.email.set(res.email || "");
          this.experienceYears.set(res.experienceYears ?? 0);
          this.skillSet.set(res.skillSet || "");

          // 🔥 Convert the DB path into usable URL
          this.resumeUrl.set(
            res.resumePath ? "http://localhost:5147" + res.resumePath : null
          );

          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set("Failed to load candidate profile.");
          this.loading.set(false);
        }
      });
  }


  // fetchProfile() {
  //   this.loading.set(true);
  //   this.errorMessage.set(null);

  //   this.http.get<any>('http://localhost:5147/api/candidate/secure/profile', {
  //     withCredentials: true
  //   })
  //     .subscribe({
  //       next: (res) => {
  //         this.fullName.set(res.fullName || '');
  //         this.email.set(res.email || '');
  //         this.experienceYears.set(res.experienceYears ?? 0);
  //         this.skillSet.set(res.skillSet || '');
  //         this.resumeUrl.set(res.resumePath || null);
  //         this.loading.set(false);
  //       },
  //       error: () => {
  //         this.errorMessage.set('Failed to load candidate profile.');
  //         this.loading.set(false);
  //       }
  //     });
  // }

}

