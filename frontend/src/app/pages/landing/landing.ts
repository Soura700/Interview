import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule], //Spinner for the loading
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {

  loading = false;
  loadingText = "";

  constructor(private router: Router) {}

  goToLogin() {
    this.loading = true;
    this.loadingText = "Loading... Please wait";

    setTimeout(() => {
      this.router.navigate(['/login']);
      this.loading = false;
    }, 2800);  // smooth transition
  }
}
