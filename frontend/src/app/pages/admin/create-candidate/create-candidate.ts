import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-candidate.html',
  styleUrls: ['./create-candidate.css']
})
export class CreateCandidate {
  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);

  // 🧑 Candidate object (no resume here)
  candidate = {
    fullName: '',
    email: '',
    skillSet: '',
    experienceYears: 0,
    "resumePath": "",
    role: 'Candidate'
  };

  constructor(private http: HttpClient) {}

  // 🚀 Submit
  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    this.http
      .post('http://localhost:5147/api/Candidate/create', this.candidate)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Candidate Created:', res);
          this.success.set(true);
          alert(`✅ Candidate ${this.candidate.fullName} created successfully!`);
          form.resetForm();
        },
        error: (err) => {
          alert('❌ Failed to create candidate. ' + (err.error?.message || ''));
          this.errorMessage.set(err.error?.message || '❌ Failed to create candidate.');
        }
      });
  }
}
