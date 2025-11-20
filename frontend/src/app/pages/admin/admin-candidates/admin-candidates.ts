// // // import { Component, OnInit } from '@angular/core';
// // // import { HttpClient } from '@angular/common/http';
// // // import { CommonModule } from '@angular/common';
// // // import { FormsModule } from '@angular/forms';

// // // @Component({
// // //   selector: 'app-admin-candidates',
// // //   standalone: true,
// // //   imports: [CommonModule, FormsModule],
// // //   templateUrl: './admin-candidates.html',
// // //   styleUrls: ['./admin-candidates.css']
// // // })
// // // export class AdminCandidatesComponent implements OnInit {

// // //   candidates: any[] = [];
// // //   total = 0;
// // //   page = 1;
// // //   pageSize = 10;
// // //   loading = false;
// // //   error = "";

// // //   constructor(private http: HttpClient) {}

// // //   ngOnInit() {
// // //     this.loadCandidates();
// // //   }

// // //   loadCandidates() {
// // //     this.loading = true;
// // //     this.error = "";

// // //     // ?page=1&pageSize=10
// // //     const url = `http://localhost:5147/api/Candidate/all?page=${this.page}&pageSize=${this.pageSize}`;

// // //     this.http.get<any>(url, { withCredentials: true })
// // //       .subscribe({
// // //         next: (res) => {
// // //           this.candidates = res.candidates;
// // //           this.total = res.total;
// // //           this.pageSize = res.pageSize;
// // //           this.loading = false;
// // //           console.log("Hello")
// // //           console.log(res);
// // //         },
// // //         error: () => {
// // //           this.error = "Failed to load candidates";
// // //           this.loading = false;
// // //         }
// // //       });
// // //   }

// // //   nextPage() {
// // //     if (this.page * this.pageSize < this.total) {
// // //       this.page++;
// // //       this.loadCandidates();
// // //     }
// // //   }

// // //   prevPage() {
// // //     if (this.page > 1) {
// // //       this.page--;
// // //       this.loadCandidates();
// // //     }
// // //   }
// // // }



// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';

// // @Component({
// //   selector: 'app-admin-candidates',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule],
// //   templateUrl: './admin-candidates.html',
// //   styleUrls: ['./admin-candidates.css']
// // })
// // export class AdminCandidatesComponent implements OnInit {

// //   // candidates: any[] = [];
// //   // total = 0;
// //   // page = 1;
// //   // pageSize = 10;
// //   // loading = false;
// //   // error = ""

// //   candidates: any[] = [];
// //   total = 0;
  
// //   page = 1;
// //   pageSize = 5;   // Now it will load 5 candidates per page
// //   loading = false;
// //   error = "";

// //   constructor(private http: HttpClient) { }

// //   ngOnInit() {
// //     this.loadCandidates();
// //   }

// //   loadCandidates() {
// //     this.loading = true;
// //     this.error = "";

// //     const url = `http://localhost:5147/api/Candidate/all?page=${this.page}&pageSize=${this.pageSize}`;

// //     this.http.get<any>(url, { withCredentials: true })
// //       .subscribe({
// //         next: (res) => {

// //           console.log("Hello");
// //           console.log("API Response:", res);

// //           // 🟢 Safeguard against undefined values
// //           this.candidates = res?.candidates ?? [];
// //           this.total = res?.total ?? 0;
// //           this.pageSize = res?.pageSize ?? this.pageSize;

// //           this.loading = false;
// //         },
// //         error: (err) => {
// //           console.error("ERROR:", err);

// //           this.error = err.error?.message || "Failed to load candidates";
// //           this.loading = false;
// //         }
// //       });
// //   }

// //   nextPage() {
// //     if (this.page * this.pageSize < this.total) {
// //       this.page++;
// //       this.loadCandidates();
// //     }
// //   }

// //   prevPage() {
// //     if (this.page > 1) {
// //       this.page--;
// //       this.loadCandidates();
// //     }
// //   }
// // }



// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-admin-candidates',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin-candidates.html',
//   styleUrls: ['./admin-candidates.css']
// })
// export class AdminCandidatesComponent implements OnInit {

//   candidates: any[] = [];
//   total = 0;

//   page = 1;
//   pageSize = 5;  // Show 5 items per page
//   loading = false;
//   error = "";

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadCandidates();
//   }

//   loadCandidates() {
//     this.loading = true;
//     this.error = "";
//     this.candidates = [];   // clear old UI

//     const url = `http://localhost:5147/api/Candidate/all?page=${this.page}&pageSize=${this.pageSize}`;

//     console.log("Calling API:", url);

//     this.http.get<any>(url, { withCredentials: true })
//       .subscribe({
//         next: (res) => {
//           console.log("API Response:", res);

//           this.candidates = res.candidates ?? [];
//           this.total = res.total ?? 0;
//           this.pageSize = res.pageSize ?? this.pageSize;

//           this.loading = false;
//         },
//         error: (err) => {
//           console.error("ERROR:", err);

//           this.error = err.error?.message || "Failed to load candidates";
//           this.loading = false;
//         }
//       });
//   }

//   nextPage() {
//     if (this.page * this.pageSize < this.total) {
//       this.page++;
//       this.loadCandidates();
//     }
//   }

//   prevPage() {
//     if (this.page > 1) {
//       this.page--;
//       this.loadCandidates();
//     }
//   }
// }



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-candidates.html',
  styleUrls: ['./admin-candidates.css']
})
export class AdminCandidatesComponent implements OnInit {

  candidates: any[] = [];
  total = 0;

  page = 1;
  pageSize = 5;
  loading = false;
  error = "";

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef  // 👈 REQUIRED FOR ZONELESS MODE
  ) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    this.error = "";
    this.candidates = [];

    const url = `http://localhost:5147/api/Candidate/all?page=${this.page}&pageSize=${this.pageSize}`;

    console.log("Calling API:", url);

    this.http.get<any>(url, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log("API Response:", res);

          this.candidates = res?.candidates ?? [];
          this.total = res?.total ?? 0;
          this.pageSize = res?.pageSize ?? this.pageSize;
          this.loading = false;

          // 👇 IMPORTANT → updates UI in zoneless mode
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR:", err);

          this.error = err.error?.message || "Failed to load candidates";
          this.loading = false;

          // 👇 Force UI update
          this.cdr.detectChanges();
        }
      });
  }

  nextPage() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
      this.loadCandidates();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadCandidates();
    }
  }
}
