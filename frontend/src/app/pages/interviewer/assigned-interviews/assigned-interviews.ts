// import { Component, signal, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-assigned-interviews',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './assigned-interviews.html',
//   styleUrl: './assigned-interviews.css'
// })
// export class AssignedInterviews implements OnInit {

//   loading = signal(false);
//   noData = signal(false);
//   assigned = signal<any[]>([]);
//   selectedDate: string | null = null;
//   showDatePickerFor: number | null = null;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchAssigned();
//   }

//   /** 🔹 Fetch assigned interviews using InterviewerId from localStorage */
//   fetchAssigned() {
//     const interviewerId = localStorage.getItem("interviewerId");
//     if (!interviewerId) {
//       this.noData.set(true);
//       return;
//     }

//     this.loading.set(true);

//     // this.http.get<any[]>(`http://localhost:5147/api/Interviewer/assignments/${interviewerId}`)
    
//     this.http.get<any[]>(`http://localhost:5147/api/interviewer/secure/assigned`)
//       .subscribe({
//         next: (res) => {
//           this.assigned.set(res);
//           this.noData.set(res.length === 0);
//           this.loading.set(false);
//         },
//         error: () => {
//           this.noData.set(true);
//           this.loading.set(false);
//         }
//       });
//   }

//   /** 🔹 Open Date Picker */
//   openDatePicker(assignmentId: number) {
//     this.showDatePickerFor = assignmentId;
//   }

//   /** 🔹 Accept interview with selected date */
//   acceptInterview(assignmentId: number) {

//     if (!this.selectedDate) {
//       alert("Please choose a date before accepting.");
//       return;
//     }

//     this.http.put(
//       `http://localhost:5147/api/Interviewer/assignments/${assignmentId}/status?status=Accepted&scheduledDate=${this.selectedDate}`,
//       {}
//     ).subscribe(() => {
//       alert("Interview Accepted!");
//       this.removeCard(assignmentId);
//       this.showDatePickerFor = null;
//       this.selectedDate = null;
//     });
//   }

//   /** 🔹 Reject interview */
//   rejectInterview(assignmentId: number) {
//     this.http.put(
//       `http://localhost:5147/api/Interviewer/assignments/${assignmentId}/status?status=Rejected`,
//       {}
//     ).subscribe(() => {
//       alert("Interview Rejected.");
//       this.removeCard(assignmentId);
//     });
//   }

//   /** 🔹 Remove candidate card from UI after action */
//   removeCard(assignmentId: number) {
//     const updated = this.assigned().filter(a => a.id !== assignmentId);
//     this.assigned.set(updated);
//     this.noData.set(updated.length === 0);
//   }

// }



import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assigned-interviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-interviews.html',
  styleUrl: './assigned-interviews.css'
})
export class AssignedInterviews implements OnInit {

  loading = signal(false);
  noData = signal(false);
  assigned = signal<any[]>([]);
  selectedDate: string | null = null;
  showDatePickerFor: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAssigned();
  }

  /** 🔹 Fetch assigned interviews for logged-in interviewer */
  fetchAssigned() {
    this.loading.set(true);

    this.http.get<any[]>("http://localhost:5147/api/interviewer/secure/assigned", {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.assigned.set(res);
        this.noData.set(res.length === 0);
        this.loading.set(false);
      },
      error: () => {
        this.noData.set(true);
        this.loading.set(false);
      }
    });
  }

  /** 🔹 Open date picker */
  openDatePicker(assignmentId: number) {
    this.showDatePickerFor = assignmentId;
  }

  /** 🔹 Accept interview */
  acceptInterview(assignmentId: number) {
    if (!this.selectedDate) {
      alert("Please choose a date before accepting.");
      return;
    }

    const isoDate = new Date(this.selectedDate).toISOString();

    this.http.put(
      `http://localhost:5147/api/interviewer/assignments/${assignmentId}/status`,
      {},
      {
        params: {
          status: "Accepted",
          scheduledDate: this.selectedDate
        },
        withCredentials: true
      }
    ).subscribe(() => {
      alert("Interview Accepted!");
      this.removeCard(assignmentId);
      this.showDatePickerFor = null;
      this.selectedDate = null;
    });
  }

  /** 🔹 Reject interview */
  rejectInterview(assignmentId: number) {
    this.http.put(
      `http://localhost:5147/api/interviewer/assignments/${assignmentId}/status`,
      {},
      {
        params: {
          status: "Rejected"
        },
        withCredentials: true
      }
    ).subscribe(() => {
      alert("Interview Rejected.");
      this.removeCard(assignmentId);
    });
  }

  /** 🔹 Remove card from UI */
  removeCard(assignmentId: number) {
    const updated = this.assigned().filter(a => a.id !== assignmentId);
    this.assigned.set(updated);
    this.noData.set(updated.length === 0);
  }
}
