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
  upcoming = signal<any[]>([]);
  noData = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCandidateId();
  }

  /** Load candidateId from secure endpoint or localStorage */
  loadCandidateId() {
    const storedId = localStorage.getItem("candidateId");

    if (storedId) {
      this.fetchUpcoming(storedId);
      return;
    }

    this.http.get<any>("http://localhost:5147/api/candidate/secure/profile", {
      withCredentials: true
    }).subscribe({
      next: (profile) => {
        if (profile?.id) {
          localStorage.setItem("candidateId", profile.id.toString());
          this.fetchUpcoming(profile.id);
        }
      },
      error: () => {
        this.noData.set(true);
      }
    });
  }

  /** Fetch interview schedule for candidate */
  fetchUpcoming(candidateId: string | number) {
    this.loading.set(true);

    this.http.get<any[]>(`http://localhost:5147/api/candidate/assignments/${candidateId}`)
      .subscribe({
        next: (res) => {

          // Filter upcoming or active interviews
          const active = res.filter(item =>
            item.status === "Accepted" || item.status === "Completed"
          );

          this.upcoming.set(active);
          this.noData.set(active.length === 0);
          this.loading.set(false);
        },
        error: () => {
          this.noData.set(true);
          this.loading.set(false);
        }
      });
  }

  openMeeting(link: string) {
    if (!link) {
      alert("Meeting link not available.");
      return;
    }
    window.open(link, "_blank");
  }
}
