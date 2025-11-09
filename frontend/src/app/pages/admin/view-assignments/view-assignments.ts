import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-assignments.html',
  styleUrls: ['./view-assignments.css']
})
export class ViewAssignments {
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  assignments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAssignments();
  }

  fetchAssignments() {
    this.loading.set(true);
    this.http
      .get('http://localhost:5147/api/Admin/assignments')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.assignments = res;
          this.errorMessage.set(null);
        },
        error: () => this.errorMessage.set('❌ Failed to load assignments.')
      });
  }
}
