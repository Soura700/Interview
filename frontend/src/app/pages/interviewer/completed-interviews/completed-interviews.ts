import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-completed-interviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-interviews.html',
  styleUrl: './completed-interviews.css'
})
export class CompletedInterviews implements OnInit {

  loading = signal(false);
  completed = signal<any[]>([]);
  noData = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInterviewerId();
  }

  loadInterviewerId() {
    const storedId = localStorage.getItem("interviewerId");

    if (storedId) {
      this.fetchCompleted(storedId);
      return;
    }

    // Fetch secure profile
    this.http.get<any>("http://localhost:5147/api/interviewer/secure/profile", { withCredentials: true })
      .subscribe({
        next: (profile) => {
          if (profile?.id) {
            localStorage.setItem("interviewerId", profile.id.toString());
            this.fetchCompleted(profile.id);
          }
        },
        error: () => {
          this.noData.set(true);
        }
      });
  }

  /** GET completed interviews */
  fetchCompleted(interviewerId: string | number) {
    this.loading.set(true);

    this.http.get<any[]>(`http://localhost:5147/api/interviewer/assignments/completed/${interviewerId}`)
      .subscribe({
        next: (res) => {
          this.completed.set(res);
          this.noData.set(res.length === 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.noData.set(true);
        }
      });
  }
}
