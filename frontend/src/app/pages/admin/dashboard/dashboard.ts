import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  constructor(private router: Router , private http: HttpClient) {}

  logout() {
    this.http.post('http://localhost:5147/api/admin/auth/logout', {}, { withCredentials: true })
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
