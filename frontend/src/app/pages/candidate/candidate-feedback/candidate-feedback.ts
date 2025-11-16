import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-feedback.html',
  styleUrl: './candidate-feedback.css'
})
export class CandidateFeedback {

  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);

  feedbackText = signal('');

  constructor(private http: HttpClient) {}

  submitFeedback() {
    if (!this.feedbackText().trim()) {
      this.errorMessage.set("Feedback cannot be empty.");
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.success.set(false);

    const payload = {
      remarks: this.feedbackText()
    };

    this.http.post("http://localhost:5147/api/Candidate/submit-feedback", payload)
      .subscribe(
        () => {
          this.success.set(true);
          this.loading.set(false);
          this.feedbackText.set('');
        },
        () => {
          this.errorMessage.set("Failed to submit feedback.");
          this.loading.set(false);
        }
      );
  }
}
