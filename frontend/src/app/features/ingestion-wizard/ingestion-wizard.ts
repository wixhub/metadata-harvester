import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { MetadataFormat } from '../../core/models/metadata.model';

@Component({
  selector: 'app-ingestion-wizard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ingestion-wizard.html',
  styleUrl: './ingestion-wizard.scss',
})
export class IngestionWizard {
  private fb = inject(FormBuilder);
  private api = inject(MetadataApiService);
  private router = inject(Router);

  uploading = signal<boolean>(false);
  uploadProgress = signal<number>(0);
  selectedFile = signal<File | null>(null);

  form = this.fb.group({
    format: ['MOVEBANK_XML' as MetadataFormat, Validators.required],
    targetCollection: ['', Validators.required],
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  onSubmit() {
    // Validate form and ensure a file is selected before proceeding
    if (this.form.invalid || !this.selectedFile()) return;

    // Set uploading state to true and reset progress
    this.uploading.set(true);

    // Construct the payload required for the ingestion API
    const payload = {
      format: this.form.value.format as MetadataFormat,
      file: this.selectedFile()!,
      targetCollection: this.form.value.targetCollection!,
    };

    // Call the API service and handle HTTP progress/response events
    this.api.uploadDataset(payload).subscribe({
      next: (event) => {
        // Track and update the file upload progress percentage
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent = Math.round(100 * (event.loaded / event.total));
          this.uploadProgress.set(percent);
        }
        // Handle the final successful server response
        else if (event.type === HttpEventType.Response) {
          this.uploading.set(false);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        // Handle server-side errors or pipeline failures
        this.uploading.set(false);
        alert('Ingestion pipeline error or validation failure occurred: \n\n' + err.message);
      },
    });
  }
}
