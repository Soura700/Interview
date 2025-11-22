// import { Component, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-interview-update',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './interview-update.html',
//   styleUrls: ['./interview-update.css']
// })
// export class InterviewUpdate implements OnInit {

//   loading = signal(false);
//   schedule = signal<any[]>([]);
//   noData = signal(false);
//   assigned = signal<any[]>([]);

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchAssigned(),
//     this.fetchSchedule();
//   }

//   fetchAssigned() {
//     this.loading.set(true);

//     this.http.get<any[]>("http://localhost:5147/api/candidate/secure/profile", {
//       withCredentials: true
//     }).subscribe({
//       next: (res) => {
//         this.assigned.set(res);
//         this.noData.set(res.length === 0);
//         this.loading.set(false);
//       },
//       error: () => {
//         this.noData.set(true);
//         this.loading.set(false);
//       }
//     });
//     console.log(this.assigned());
//   }

//   fetchSchedule() {
//     //console.log(candidateId);
//      this.loading.set(true);
//     this.http.get<any[]>(`http://localhost:5147/api/candidate/secure/assignment/schedule`,{withCredentials: true})
//        .subscribe({
//          next: (res) => {
//            this.schedule.set(res);
//            this.noData.set(res.length === 0);
//            this.loading.set(false);
//          },
//          error: () => {
//            this.noData.set(true);
//            this.loading.set(false);
//          }
//        });
//    }
//   openMeeting(link: string) {
//      if (!link) {
//        alert("Meeting link not available.");
//        return;
//      }    window.open(link, "_blank");
//    }

//    /** 🔹 Accept or Reject Offer Letter */
//   updateOfferStatus(assignmentId: number, decision: number) {

//     this.http.put(
//       `http://localhost:5147/api/candidate/secure/assignment/offer`,
//       {},
//       {
//         params: {
//           offerStatus: decision,    // 1 = Accept, 0 = Reject
//           //assignmentId: assignmentId
//         },
//         withCredentials: true
//       }
//     ).subscribe({
//       next: () => {
//         alert(decision === 1 ? "Offer Accepted!" : "Offer Rejected.");

//         // 🔥 Update UI instantly — NO RELOAD NEEDED
//         const updated = this.schedule().map(item => {
//           if (item.id === assignmentId) {
//             return {
//               ...item,
//               offerStatus: decision   // <-- Update UI state
//             };
//           }
//           return item;
//         });

//         this.schedule.set(updated);  // <-- Trigger UI update
//       }
//     });
//   }
// }


import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interview-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interview-update.html',
  styleUrls: ['./interview-update.css']
})
export class InterviewUpdate implements OnInit {

  loading = signal(false);
  schedule = signal<any[]>([]);
  noData = signal(false);
  assigned = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchAssigned();
    this.fetchSchedule();
  }

  fetchAssigned() {
    this.loading.set(true);

    this.http.get<any[]>("http://localhost:5147/api/candidate/secure/profile", {
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

  fetchSchedule() {
    this.loading.set(true);

    this.http.get<any[]>(
      `http://localhost:5147/api/candidate/secure/assignment/schedule`,
      { withCredentials: true }
    ).subscribe({
      next: (res) => {

        // 🔥 Filter: Keep only non-pending interviewerStatus
        const filtered = res.filter(item => item.interviewerStatus !== 'Pending');

        this.schedule.set(filtered);

        // 🔥 If filtered list becomes empty -> show "no interviews"
        this.noData.set(filtered.length === 0);

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

  /** 🔹 Accept or Reject Offer Letter */
  updateOfferStatus(assignmentId: number, decision: number) {

    this.http.put(
      `http://localhost:5147/api/candidate/secure/assignment/offer`,
      {},
      {
        params: { offerStatus: decision },
        withCredentials: true
      }
    ).subscribe({
      next: () => {
        alert(decision === 1 ? "Offer Accepted!" : "Offer Rejected.");

        // Update UI instantly
        const updated = this.schedule().map(item => {
          if (item.id === assignmentId) {
            return { ...item, offerStatus: decision };
          }
          return item;
        });

        this.schedule.set(updated);
      }
    });
  }
}

