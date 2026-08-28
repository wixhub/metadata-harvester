import { Component, computed, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { SupportMailService } from '../../core/services/support-mail.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, MatTableModule, MatSortModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private apiService = inject(MetadataApiService);
  private mailService = inject(SupportMailService);

  // Table columns definition
  displayedColumns: string[] = ['id', 'title', 'format', 'status', 'recordCount', 'updatedAt'];

  // MatTableDataSource for sorting capabilities
  dataSource = new MatTableDataSource<any>([]);

  // ViewChild setter to bind MatSort as soon as the table appears in the DOM
  @ViewChild(MatSort) set sort(value: MatSort) {
    if (value) {
      this.dataSource.sort = value;
      // Set default sorting to updatedAt (descending) if not already set
      if (!value.active) {
        value.active = 'updatedAt';
        value.direction = 'desc';
      }
    }
  }

  // Reactive signals bound directly to the service's httpResource states
  datasets = this.apiService.datasetsResource.value;
  failedDatasets = this.apiService.failedDatasetsResource.value; // Separate array for error logs / failed records
  loading = this.apiService.datasetsResource.isLoading;

  // Countdown timer signal for Render free instance wake-up (in seconds)
  wakeUpCountdown = signal<number>(150);

  // Computed metrics for cards
  successfulCount = computed(() => this.datasets().filter((d) => d.status === 'PROCESSED').length);

  // Failed validations count bound directly to the service resource
  failedValidationsCount = this.apiService.failedValidationsResource.value;

  // Total datasets = Successful + Failed
  totalDatasetsCount = computed(() => {
    const success = this.successfulCount();
    const failed = this.failedValidationsCount() ?? 0;
    return success + failed;
  });

  // Active card selector: set to 'success' (middle card) by default
  activeCard = signal<'total' | 'success' | 'failed'>('success');

  constructor() {
    // Automatically update table data source whenever active card or raw data changes
    effect(() => {
      const card = this.activeCard();
      let data: any[] = [];

      if (card === 'success') {
        data = this.datasets().filter((d) => d.status === 'PROCESSED');
      } else if (card === 'failed') {
        data = this.failedDatasets();
      } else {
        data = [
          ...this.datasets().filter((d) => d.status === 'PROCESSED'),
          ...this.failedDatasets(),
        ];
      }

      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    this.startWakeUpTimer();
  }

  // Method to change the active card view, switch table contents, and reset sorting to updatedAt
  selectCard(cardType: 'total' | 'success' | 'failed'): void {
    this.activeCard.set(cardType);

    // Reset sorting back to updatedAt (descending) whenever a card is switched
    if (this.dataSource.sort) {
      this.dataSource.sort.active = 'updatedAt';
      this.dataSource.sort.direction = 'desc';
      // Trigger sort sort-state re-evaluation
      this.dataSource._updateChangeSubscription();
    }
  }

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
