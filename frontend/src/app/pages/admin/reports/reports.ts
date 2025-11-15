import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {

  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  skill: string = "";

  rejected: any[] = [];
  proposalRejected: any[] = [];
  successBySkill: any[] = [];

  loading = false;
  error = "";

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  // 🔥 FIXED: Added withCredentials for JWT Admin cookie
  loadRejected() {
    this.loading = true;
    this.http.get(
      `http://localhost:5147/api/reports/rejected?year=${this.year}&month=${this.month}`,
      { withCredentials: true }
    )
      .subscribe({
        next: (res: any) => {
          console.log("Rejected raw:", res);
          console.log("Keys:", Object.keys(res[0]));

          console.log("Rejected candidates:");
          console.log(res);
          this.rejected = res;
          this.loading = false;
        },
        error: () => {
          this.error = "Failed to load rejected list";
          this.loading = false;
        }
      });
  }

  loadProposalRejected() {
    this.loading = true;
    this.http.get(
      `http://localhost:5147/api/reports/proposal-rejected?year=${this.year}&month=${this.month}`,
      { withCredentials: true }
    )
      .subscribe({
        next: (res: any) => {
          this.proposalRejected = res;
          this.loading = false;
        },
        error: () => {
          this.error = "Failed to load proposal rejected list";
          this.loading = false;
        }
      });
  }

  // 🔥 FIXED: Correct query parameter → skill=
  // 🔥 FIXED: Added withCredentials
  loadSuccessBySkill() {
    if (!this.skill.trim()) {
      alert("Enter a skill!");
      return;
    }

    this.loading = true;
    this.http.get(
      `http://localhost:5147/api/reports/success-by-skill?year=${this.year}&month=${this.month}&skill=${this.skill}`,
      { withCredentials: true }
    )
      .subscribe({
        next: (res: any) => {
          this.successBySkill = res;
          this.loading = false;
        },
        error: () => {
          this.error = "Failed to load successful candidates";
          this.loading = false;
        }
      });
  }

}