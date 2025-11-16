import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interview-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-update.html',
  styleUrl: './interview-update.css'
})
export class InterviewUpdate implements OnInit {

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  upcoming = signal<any[]>([]);
  accepted = signal<any[]>([]);
  rejected = signal<any[]>([]);
  completed = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchInterviewDetails();
  }

  fetchInterviewDetails() {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.http.get('http://localhost:5147/api/candidate/secure/interviews', {
      withCredentials: true
    })
    .subscribe({
      next: (res: any) => {
        this.upcoming.set(res.upcoming ?? []);
        this.accepted.set(res.accepted ?? []);
        this.rejected.set(res.rejected ?? []);
        this.completed.set(res.completed ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load interview details.');
        this.loading.set(false);
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.http.put(
      `http://localhost:5147/api/Candidate/update-status/${id}?status=${status}`,
      {},
      { withCredentials: true }
    )
    .subscribe({
      next: () => {
        alert("Status updated!");
        this.fetchInterviewDetails();
      },
      error: () => {
        alert("Failed to update status.");
      }
    });
  }
}
