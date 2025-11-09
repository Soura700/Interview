import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-interviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-interviewer.html',
  styleUrls: ['./create-interviewer.css']
})
export class CreateInterviewer {
  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);

  interviewer = {
    fullName: '',
    email: '',
    skillSet: '',
    interviewLevel: '',
    experienceYears: 0,
    isAvailable: true
  };

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    this.http.post('http://localhost:5147/api/Interviewer/create', this.interviewer)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Interviewer Created:', res);
          this.success.set(true);
          alert(`✅ Interviewer ${this.interviewer.fullName} created successfully!`);
          form.resetForm();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || '❌ Failed to create interviewer.');
        }
      });
  }
}
