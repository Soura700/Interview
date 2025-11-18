import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interviewer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './interviewer-dashboard.html',
  styleUrl: './interviewer-dashboard.css'
})
export class InterviewerDashboard {

  constructor(private router: Router, private http: HttpClient) {}

  logout() {
    this.http.post('http://localhost:5147/api/interviewer/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log('Logout successful:', res);
          localStorage.clear(); // clear local storage
          this.router.navigate(['/login']); // redirect to login page
        },
        error: (err) => {
          console.error('Logout error:', err);
        }
      });
  }
}
