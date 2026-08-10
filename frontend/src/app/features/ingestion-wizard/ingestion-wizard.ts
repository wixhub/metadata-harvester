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
  errorMessage = signal<string | null>(null); // <--- Added error message signal

  form = this.fb.group({
    format: ['MOVEBANK_XML' as MetadataFormat, Validators.required],
    targetCollection: ['', Validators.required],
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.errorMessage.set(null); // Clear previous error on new file selection
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedFile()) return;

    this.uploading.set(true);
    this.uploadProgress.set(0);
    this.errorMessage.set(null); // Reset error state

    const payload = {
      format: this.form.value.format as MetadataFormat,
      file: this.selectedFile()!,
      targetCollection: this.form.value.targetCollection!,
    };

    this.api.uploadDataset(payload).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent = Math.round(100 * (event.loaded / event.total));
          this.uploadProgress.set(percent);
        } else if (event.type === HttpEventType.Response) {
          this.uploading.set(false);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.uploading.set(false);

        // Extract clean error message sent from Spring Boot backend (or fallback)
        const serverMessage = err.error?.message || err.error || err.message;
        this.errorMessage.set(
          serverMessage || 'Validation failed. Please check your dataset structure.',
        );
      },
    });
  }
}
