// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-upload-resume',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './upload-resume.html',
//   styleUrl: './upload-resume.css'
// })
// export class UploadResume {

//   loading = signal(false);
//   success = signal(false);
//   errorMessage = signal<string | null>(null);
//   resumeUrl = signal<string | null>(null);

//   selectedFile: File | null = null;

//   constructor(private http: HttpClient) { }

//   // 👇 File selection handler
//   onFileChange(event: any) {
//     this.selectedFile = event.target.files[0] || null;
//   }

//   // 👇 Upload handler
//   upload() {
//     if (!this.selectedFile) {
//       this.errorMessage.set("Please select a PDF file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", this.selectedFile);

//     this.http.post(
//       "http://localhost:5147/api/candidate/secure/upload-resume",
//       formData,
//       { withCredentials: true }
      
//     )
//       .subscribe({
//         next: (res: any) => {
//           this.success.set(true);
//           this.resumeUrl.set(res.resumePath);
//           this.loading.set(false);
//         },
//         error: (err) => {
//           this.errorMessage.set("Upload failed.");
//           this.loading.set(false);
//         }
//       });
//   }
// }


import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-resume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-resume.html',
  styleUrl: './upload-resume.css'
})
export class UploadResume {

  loading = signal(false);
  success = signal(false);
  errorMessage = signal<string | null>(null);
  resumeUrl = signal<string | null>(null);

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  upload() {
    if (!this.selectedFile) {
      this.errorMessage.set("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    this.http.post(
      "http://localhost:5147/api/candidate/secure/upload-resume",
      formData,
      { withCredentials: true }
    )
    .subscribe({
      next: (res: any) => {
        this.success.set(true);
        this.resumeUrl.set("http://localhost:5147" + res.resumePath); // ✔ FIXED
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set("Upload failed.");
        this.loading.set(false);
      }
    });
  }
}
