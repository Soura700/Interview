import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  imports: [FormsModule],
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {
  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);

  // form model
  formData = {
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    role: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid || this.formData.newPassword !== this.formData.confirmPassword) {
      this.errorMessage.set("Passwords do not match.");
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    // select endpoint based on role
    let apiUrl = '';
    if (this.formData.role === 'Candidate') {
      apiUrl = 'http://localhost:5147/api/Candidate/changepassword';
    } else if (this.formData.role === 'Interviewer') {
      apiUrl = 'http://localhost:5147/api/Interviewer/changepassword';
    } else {
      this.errorMessage.set('Select a role first.');
      this.loading.set(false);
      return;
    }

    // call backend API
    this.http.post(apiUrl, {
      email: this.formData.email,
      oldPassword: this.formData.oldPassword,
      newPassword: this.formData.newPassword
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: (res: any) => {
        this.success.set(true);
        alert('✅ Password changed successfully! Please log in again.');
        form.resetForm();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || '❌ Password change failed.');
      }
    });
  }
}
