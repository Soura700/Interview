import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports : [FormsModule],
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  // ✅ Signals for reactive UI
  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);

  // Form model
  user = {
    fullName: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private authService: Auth) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    this.authService
      .register(this.user)
      .pipe(finalize(() => this.loading.set(false))) // ✅ auto stop loading
      .subscribe({
        next: (res) => {
          this.success.set(true);
          alert('✅ Registration successful!');
          form.resetForm();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || '❌ Registration failed!');
        }
      });
  }
}
