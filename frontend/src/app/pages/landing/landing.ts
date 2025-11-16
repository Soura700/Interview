import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  // All buttons redirect to the generic login page for now
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
