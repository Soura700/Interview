// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-offer-letter',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './offer-letter.html',
//   styleUrls: ['./offer-letter.css']
// })
// export class OfferLetterComponent {

//   candidateId: number | null = null;
//   error = "";
//   loading = false;

//   constructor(private http: HttpClient) {}

//   generateOffer() {
//     this.error = "";

//     if (!this.candidateId) {
//       this.error = "⚠️ Please enter a valid Candidate ID!";
//       return;
//     }

//     this.loading = true;

//     this.http.get(
//       `http://localhost:5147/api/admin/offer-letter/${this.candidateId}`,
//       { responseType: 'blob', withCredentials: true }
//     ).subscribe({
//       next: (pdf) => {
//         this.loading = false;

//         const blob = new Blob([pdf], { type: "application/pdf" });
//         const url = window.URL.createObjectURL(blob);
//         window.open(url, "_blank");  // opens the PDF in new tab
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = err.error?.message || "❌ Failed to generate offer letter.";
//       }
//     });
//   }
// }



import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-offer-letter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offer-letter.html',
  styleUrls: ['./offer-letter.css']
})
export class OfferLetterComponent {

  candidateId: number = 0;
  loading = false;
  error: string = "";
  success: string = "";

  constructor(private http: HttpClient) { }

  // ------------------------------
  // DOWNLOAD OFFER LETTER
  // ------------------------------
  generateOffer() {
    this.resetState();

    if (!this.candidateId) {
      this.error = "Please enter a valid Candidate ID";
      return;
    }

    this.loading = true;

    const url = `http://localhost:5147/api/admin/offer-letter/${this.candidateId}`;

    this.http.get(url, { responseType: 'blob', withCredentials: true })
      .subscribe({
        next: (blob) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `OfferLetter_${this.candidateId}.pdf`;
          a.click();

          this.success = "Offer Letter downloaded successfully!";
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || "Unable to generate Offer Letter";
          this.loading = false;
        }
      });
  }

  // ------------------------------
  //  SEND OFFER LETTER BY EMAIL
  // ------------------------------
  sendOffer() {
    this.resetState();

    console.log("🔍 sendOffer() fired!");

    if (!this.candidateId) {
      this.error = "Please enter a valid Candidate ID";
      return;
    }

    this.loading = true;
    console.log("📨 Sending API request for candidate:", this.candidateId);

    const url = `http://localhost:5147/api/admin/offer-letter/send/${this.candidateId}`;
    console.log("🌐 API URL:", url);

    this.http.post(url, {}, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log("✅ API Response:", res);
          this.success = res.message || "Offer Letter Sent!";
          this.loading = false;
        },
        error: (err) => {
          console.error("❌ API Error:", err);
          this.error = err.error?.message || "Failed to send offer letter";
          this.loading = false;
        }
      });
  }


  resetState() {
    this.error = "";
    this.success = "";
  }
}
