import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upcoming-interviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-interviews.html',
  styleUrl: './upcoming-interviews.css'
})
export class UpcomingInterviews implements OnInit {

  loading = signal(false);
  upcoming = signal<any[]>([]);
  noData = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUpcoming();
  }

  fetchUpcoming() {
    this.loading.set(true);

    this.http.get<any[]>("http://localhost:5147/api/Interviewer/upcoming")
    .subscribe(
      (res) => {
        this.upcoming.set(res);
        this.noData.set(res.length === 0);
        this.loading.set(false);
      },
      () => {
        this.noData.set(true);
        this.loading.set(false);
      }
    );
  }

  updateStatus(event: Event, id: number) {
    const status = (event.target as HTMLSelectElement)?.value ?? '';

    this.http.post(
      "http://localhost:5147/api/Interviewer/update-status",
      { id, status }
    ).subscribe();
  }

}


