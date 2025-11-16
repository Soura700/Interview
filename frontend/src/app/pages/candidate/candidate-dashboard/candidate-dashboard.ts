import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';


@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.css',
})
export class CandidateDashboard {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
