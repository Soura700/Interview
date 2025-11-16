import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-interviewer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './interviewer-dashboard.html',
  styleUrl: './interviewer-dashboard.css'
})
export class InterviewerDashboard {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
