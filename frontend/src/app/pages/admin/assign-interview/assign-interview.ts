// import { Component, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { finalize } from 'rxjs/operators';

// @Component({
//   selector: 'app-assign-interview',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './assign-interview.html',
//   styleUrls: ['./assign-interview.css']
// })
// export class AssignInterview{
//   loading = signal(false);
//   successMessage = signal<string | null>(null);
//   errorMessage = signal<string | null>(null);

//   candidateId: number | null = null;
//   interviewLevel: string = 'L1';
//   candidate: any = null;
//   interviewers: any[] = [];
//   selectedInterviewerId: number | null = null;

//   constructor(private http: HttpClient) {}

//   // 🔍 Fetch candidate + matching interviewers based on L1/L2
//   fetchMatch() {
//     if (!this.candidateId) {
//       alert('⚠️ Please enter a candidate ID!');
//       return;
//     }

//     this.loading.set(true);
//     this.http.get(`http://localhost:5147/api/Admin/match-candidate/${this.candidateId}?interviewLevel=${this.interviewLevel}`)
//       .pipe(finalize(() => this.loading.set(false)))
//       .subscribe({
//         next: (res: any) => {
//           this.candidate = res.candidate;
//           this.interviewers = res.suggestedInterviewers;
//           this.errorMessage.set(null);
//         },
//         error: (err) => {
//           this.errorMessage.set('❌ Candidate not found or failed to fetch match.');
//           this.candidate = null;
//           this.interviewers = [];
//         }
//       });
//   }

//   // 🎯 Select interviewer (toggle)
//   selectInterviewer(id: number) {
//     this.selectedInterviewerId = this.selectedInterviewerId === id ? null : id;
//   }

//   // 🚀 Assign interview
//   assignInterview() {
//     if (!this.candidateId || !this.selectedInterviewerId) {
//       alert('⚠️ Please select a candidate and an interviewer!');
//       return;
//     }

//     const payload = {
//       interviewerId: this.selectedInterviewerId,
//       candidateId: this.candidateId,
//       interviewType: this.interviewLevel,
//       scheduledDate: new Date().toISOString()
//     };

//     this.loading.set(true);
//     this.http.post('http://localhost:5147/api/Admin/assignments', payload)
//       .pipe(finalize(() => this.loading.set(false)))
//       .subscribe({
//         next: () => {
//           this.successMessage.set('✅ Interview assigned successfully!');
//           this.selectedInterviewerId = null;
//           setTimeout(() => this.successMessage.set(null), 3000);
//         },
//         error: () => this.errorMessage.set('❌ Failed to assign interview.')
//       });
//   }
// }


import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-assign-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-interview.html',
  styleUrls: ['./assign-interview.css']
})
export class AssignInterview {
  loading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  candidateId: number | null = null;
  interviewLevel: string = 'L1';
  candidate: any = null;
  interviewers: any[] = [];
  selectedInterviewerId: number | null = null;

  constructor(private http: HttpClient) { }

  // 🔍 For searching interviewers
  searchSkill: string = '';
  searchLevel: string = '';
  searchedInterviewers: any[] = [];

  // 🌟 Search Interviewers Function
  searchInterviewers() {
    if (!this.searchSkill || !this.searchLevel) {
      alert('⚠️ Please enter both Skill and Level!');
      return;
    }

    this.loading.set(true);
    this.http
      .get(
        `http://localhost:5147/api/Admin/search/interviewers?skill=${this.searchSkill}&interviewLevel=${this.searchLevel}`
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.searchedInterviewers = res;
          this.successMessage.set('✅ Found matching interviewers!');
          this.errorMessage.set(null);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('❌ No interviewers found for this search.');
          this.searchedInterviewers = [];
        }
      });
  }


  // 🔍 Fetch candidate + matching interviewers
  fetchMatch() {
    if (!this.candidateId) {
      alert('⚠️ Please enter a candidate ID!');
      return;
    }

    this.loading.set(true);
    this.http
      .get(
        `http://localhost:5147/api/Admin/match-candidate/${this.candidateId}?interviewLevel=${this.interviewLevel}`
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.candidate = res.candidate;
          this.interviewers = res.suggestedInterviewers;
          this.errorMessage.set(null);
        },
        error: () => {
          this.errorMessage.set('❌ Candidate not found or failed to fetch match.');
          this.candidate = null;
          this.interviewers = [];
        }
      });
  }

  // Select interviewer (toggle)
  selectInterviewer(id: number) {
    this.selectedInterviewerId = this.selectedInterviewerId === id ? null : id;
  }

  // Assign interview
  assignInterview() {
    if (!this.candidateId || !this.selectedInterviewerId) {
      alert('⚠️ Please select a candidate and an interviewer!');
      return;
    }

    const payload = {
      interviewerId: this.selectedInterviewerId,
      candidateId: this.candidateId,
      interviewType: this.interviewLevel,
      scheduledDate: new Date().toISOString()
    };

    this.loading.set(true);
    this.http
      .post('http://localhost:5147/api/Admin/assignments', payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('✅ Interview assigned successfully!');
          this.selectedInterviewerId = null;
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: () => this.errorMessage.set('❌ Failed to assign interview.')
      });
  }
}
