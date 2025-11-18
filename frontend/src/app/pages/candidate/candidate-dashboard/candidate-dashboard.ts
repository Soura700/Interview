import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.css',
})
export class CandidateDashboard {
  constructor(private router: Router , private http: HttpClient) { }

  logout() {
    this.http.post('http://localhost:5147/api/candidate/auth/logout', {}, { withCredentials: true })
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