// import { Component } from '@angular/core';
// import { RouterModule, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class Dashboard {
//   constructor(private router: Router) {}

//   logout() {
//     alert('Logout functionality is currently disabled.'); 
//     // localStorage.clear();
//     // this.router.navigate(['/login']);
    
//   }
// }



import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  constructor(private router: Router) {}

  logout() {
    fetch('http://localhost:5147/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    })
    .catch(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
