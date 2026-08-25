import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { SupportMailService } from '../../core/services/support-mail.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private apiService = inject(MetadataApiService);

  // Reactive signals bound directly to the service's httpResource states
  datasets = this.apiService.datasetsResource.value;
  loading = this.apiService.datasetsResource.isLoading;

  // Countdown timer signal for Render free instance wake-up (in seconds)
  wakeUpCountdown = signal<number>(150);

  // Computed metrics for cards
  successfulCount = computed(() => this.datasets().filter((d) => d.status === 'PROCESSED').length);

  // Failed validations count bound directly to the service resource
  failedValidationsCount = this.apiService.failedValidationsResource.value;

  // Total datasets = Successful + Failed (или длина массива datasets, если туда попадают все)
  totalDatasetsCount = computed(() => {
    const success = this.successfulCount();
    const failed = this.failedValidationsCount() ?? 0;
    return success + failed;
  });

  private mailService = inject(SupportMailService);

  // Signal to manage UI notification state
  public copied = signal<boolean>(false);

  public async onContactClick(event: Event): Promise<void> {
    const success = await this.mailService.handleContact(event);

    if (success) {
      this.copied.set(true);

      // Hide the notification after 3 seconds
      setTimeout(() => {
        this.copied.set(false);
      }, 3000);
    }
  }

  ngOnInit(): void {
    this.startWakeUpTimer();
  }

  // Starts a countdown timer matching Render's free tier cold start delay (~150 seconds)
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
}
