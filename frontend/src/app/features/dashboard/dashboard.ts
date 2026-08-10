import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { DatasetRecord } from '../../core/models/metadata.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private apiService = inject(MetadataApiService);

  // Signals for state management
  datasets = signal<DatasetRecord[]>([]);
  loading = signal<boolean>(true);

  // Countdown timer signal for Render free instance wake-up (in seconds)
  wakeUpCountdown = signal<number>(100);

  // Computed metrics for cards
  successfulCount = computed(() => this.datasets().filter((d) => d.status === 'PROCESSED').length);

  failedValidationsCount = signal<number>(0);

  ngOnInit(): void {
    this.startWakeUpTimer();
    this.loadDatasets();
    this.loadFailedValidationsCount();
  }

  // Starts a countdown timer matching Render's free tier cold start delay (~50 seconds)
  private startWakeUpTimer(): void {
    const timerInterval = setInterval(() => {
      this.wakeUpCountdown.update((current) => {
        if (current <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  // Fetch datasets from the backend gateway
  loadDatasets(): void {
    this.loading.set(true);
    this.apiService.getDatasets().subscribe({
      next: (data) => {
        this.datasets.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load datasets: \n\n', err);
        this.loading.set(false);
      },
    });
  }

  loadFailedValidationsCount() {
    this.apiService.getFailedValidationsCount().subscribe({
      next: (count) => {
        this.failedValidationsCount.set(count);
      },
      error: (err) => {
        console.error('Failed to load metrics', err);
      },
    });
  }
}
