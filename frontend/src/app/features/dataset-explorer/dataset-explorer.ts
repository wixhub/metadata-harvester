import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { DatasetRecord } from '../../core/models/metadata.model';

@Component({
  selector: 'app-dataset-explorer',
  imports: [CommonModule, RouterLink],
  templateUrl: './dataset-explorer.html',
  styleUrl: './dataset-explorer.scss',
})
export class DatasetExplorer implements OnInit {
  private api = inject(MetadataApiService);
  datasets = signal<DatasetRecord[]>([]);

  ngOnInit() {
    this.api.getDatasets().subscribe((data) => this.datasets.set(data));
  }
}
