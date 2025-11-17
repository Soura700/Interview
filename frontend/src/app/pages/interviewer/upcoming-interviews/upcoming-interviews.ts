import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upcoming-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upcoming-interviews.html',
  styleUrl: './upcoming-interviews.css'
})
export class UpcomingInterviews implements OnInit {

  loading = signal(false);
  upcoming = signal<any[]>([]);
  noData = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInterviewerId();
  }

  loadInterviewerId() {
    const storedId = localStorage.getItem("interviewerId");

    if (storedId) {
      this.fetchUpcoming(storedId);
      return;
    }

    this.http.get<any>("http://localhost:5147/api/interviewer/secure/profile", {
      withCredentials: true
    }).subscribe({
      next: (profile) => {
        if (profile?.id) {
          localStorage.setItem("interviewerId", profile.id.toString());
          this.fetchUpcoming(profile.id);
        }
      },
      error: () => {
        this.noData.set(true);
      }
    });
  }

  fetchUpcoming(interviewerId: string | number) {
    this.loading.set(true);

    this.http.get<any[]>(`http://localhost:5147/api/Interviewer/assignments/${interviewerId}`)
      .subscribe({
        next: (res) => {
          const accepted = res.filter(item => item.interviewerStatus === "Accepted");

          // Add UI fields
          accepted.forEach(a => {
            a.selectedResult = "";
            a.resultRemarks = "";
          });

          this.upcoming.set(accepted);
          this.noData.set(accepted.length === 0);
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

  submitInterviewResult(id: number, result: string, remarks: string) {
    if (!result) {
      alert("Please select result before submitting.");
      return;
    }

    this.http.put(
      `http://localhost:5147/api/interviewer/assignments/${id}/result`,
      {},
      {
        params: {
          status: result,
          remarks: remarks
        }
      }
    ).subscribe(() => {
      alert("Interview result updated!");
    });
  }
}
