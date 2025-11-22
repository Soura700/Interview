import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-interviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-interviewer.html',
  styleUrls: ['./admin-interviewer.css']
})
export class AdminInterviewersComponent implements OnInit {

  interviewers: any[] = [];
  total = 0;

  page = 1;
  pageSize = 5;
  loading = false;
  error = "";

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInterviewers();
  }

  loadInterviewers() {
    this.loading = true;
    this.error = "";
    this.interviewers = [];

    const url = `http://localhost:5147/api/Interviewer/all-paged?page=${this.page}&pageSize=${this.pageSize}`;

    console.log("Calling Interviewer API:", url);

    this.http.get<any>(url, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log("API Response:", res);

          this.interviewers = res?.interviewers ?? [];
          this.total = res?.total ?? 0;
          this.pageSize = res?.pageSize ?? this.pageSize;
          this.loading = false;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR:", err);
          this.error = err.error?.message || "Failed to load interviewers";
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  nextPage() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
      this.loadInterviewers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadInterviewers();
    }
  }
}
