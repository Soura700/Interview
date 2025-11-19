import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

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
  successByMonth: any[] = [];

  loading = false;
  error = "";
  inputError = "";
  noData = false;

  statsChart: any;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  // Helper to clear all state
  clearAll() {
    this.rejected = [];
    this.proposalRejected = [];
    this.successBySkill = [];
    this.successByMonth = [];

    this.error = "";
    this.inputError = "";
    this.noData = false;
  }

  // ------------------- REJECTED -------------------
  loadRejected() {
    this.clearAll();
    this.loading = true;

    this.http.get(
      `http://localhost:5147/api/reports/rejected?year=${this.year}&month=${this.month}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        this.rejected = res;
        this.loading = false;

        if (res.length === 0) this.noData = true;

        this.cd.detectChanges();
        this.renderStatisticsChart();
      },
      error: () => {
        this.error = "Failed to load rejected candidates";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // ------------------- SUCCESS BY MONTH -------------------
  loadSuccessByMonth() {
    this.clearAll();
    this.loading = true;

    this.http.get(
      `http://localhost:5147/api/reports/success?year=${this.year}&month=${this.month}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        this.successByMonth = res;
        this.loading = false;

        if (res.length === 0) this.noData = true;

        this.cd.detectChanges();
        this.renderStatisticsChart();
      },
      error: () => {
        this.error = "Failed to load successful candidates";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // ------------------- PROPOSAL REJECTED -------------------
  loadProposalRejected() {
    this.clearAll();
    this.loading = true;

    this.http.get(
      `http://localhost:5147/api/reports/proposal-rejected?year=${this.year}&month=${this.month}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        this.proposalRejected = res;
        this.loading = false;

        if (res.length === 0) this.noData = true;

        this.cd.detectChanges();
        this.renderStatisticsChart();
      },
      error: () => {
        this.error = "Failed to load proposal rejected candidates";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // ------------------- SUCCESS BY SKILL -------------------
  loadSuccessBySkill() {
    this.clearAll();

    if (!this.skill.trim()) {
      this.inputError = "Please enter a skill before searching!";
      return;
    }

    this.loading = true;

    this.http.get(
      `http://localhost:5147/api/reports/success-by-skill?year=${this.year}&month=${this.month}&skill=${this.skill}`,
      { withCredentials: true }
    ).subscribe({
      next: (res: any) => {
        this.successBySkill = res;
        this.loading = false;

        if (res.length === 0) this.noData = true;

        this.cd.detectChanges();
        this.renderStatisticsChart();
      },
      error: () => {
        this.error = "Failed to load success-by-skill candidates";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // ------------------- CHART RENDERING -------------------
  renderStatisticsChart() {
    if (this.statsChart) {
      this.statsChart.destroy();
    }

    const rejectedCount = this.rejected.length;
    const successCount = this.successByMonth.length;

    if (rejectedCount === 0 && successCount === 0) return;

    this.statsChart = new Chart("statsChart", {
      type: 'bar',
      data: {
        labels: ['Rejected', 'Successful'],
        datasets: [{
          label: 'Candidate Count',
          data: [rejectedCount, successCount],
          backgroundColor: ['#ff4d4d', '#4CAF50'],
          borderColor: ['#b30000', '#1e7e34'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1200,
          easing: 'easeInOutQuart'
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
