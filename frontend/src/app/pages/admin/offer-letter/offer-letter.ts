import { Component, OnInit } from '@angular/core';
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
export class OfferLetterComponent implements OnInit {

  candidateId: number = 0;
  loading = false;
  error = "";
  success = "";

  history: any[] = [];  // <-- Added field

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log("OfferLetterComponent initialized");
    this.loadHistory();
  }

  loadHistory() {
    //console.log("🔄 Fetching offer letter history from API...");

    this.http.get<any[]>("http://localhost:5147/api/admin/offer-letter/candidate-offer", {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.history = res;
        console.log("✅ Offer letter history loaded:", this.history);
        setTimeout(() => {}, 0); // Trigger change detection  
      },
      error: (err) => {
        this.history = [];
        console.log("⚠️ Failed to load offer letter history.",err);
      }
    });
  }

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
          this.loading = false;
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `OfferLetter_${this.candidateId}.pdf`;
          a.click();

          alert("Offer Letter downloaded successfully!");
          window.location.reload();
          //this.loadHistory();
        },
        error: (err) => {
          this.error = err.error?.message || "Unable to generate Offer Letter";
          alert(this.error);
          this.loading = false;
        }
      });
  }

  sendOffer() {
  this.resetState();

  if (!this.candidateId) {
    this.error = "Please enter a valid Candidate ID";
    return;
  }

  this.loading = true;

  const url = `http://localhost:5147/api/admin/offer-letter/send/${this.candidateId}`;

  this.http.post(url, {}, { withCredentials: true })
    .subscribe({
      next: (res: any) => {
        console.log("Send Offer Response:", res);

        this.success = res.message;
        this.loading = false; // 🔥 FIX SPINNER

        alert(res.message || "Offer Letter Sent!");

        setTimeout(() => {
          window.location.reload(); // 🔥 Delay avoids stuck loading
        }, 150);
      },
      error: (err) => {
        this.error = err.error?.message || "Failed to send offer letter";
        alert(this.error);
        this.loading = false; // 🔥 FIX SPINNER
      }
    });
  }


  resetState() {
    this.error = "";
    this.success = "";
  }
}
