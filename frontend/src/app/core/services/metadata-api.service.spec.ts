import { Service, signal, inject } from '@angular/core';
import { httpResource, HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatasetRecord, IngestionPayload } from '../models/metadata.model';
import { environment } from '../../../environments/environment';

@Service()
export class MetadataApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Reactive signal to store the selected dataset ID for dynamic resource fetching
  private readonly selectedDatasetId = signal<string | null>(null);

  // Declarative resource for fetching all datasets with automatic mapping
  public readonly datasetsResource = httpResource<DatasetRecord[]>(
    () => `${this.baseUrl}/datasets`,
    {
      defaultValue: [],
      parse: (response: any): DatasetRecord[] => response?.content || [],
    },
  );

  // Declarative resource for fetching failed logs and mapping them to DatasetRecord interface
  public readonly failedDatasetsResource = httpResource<DatasetRecord[]>(
    () => `${this.baseUrl}/metrics/failed-validations/list`,
    {
      defaultValue: [],
      parse: (response: any): DatasetRecord[] => {
        const logs = response?.content || response || [];
        // Map backend log object to match DatasetRecord structure for the table
        return logs.map((log: any) => ({
          id: `log-${log.id}`,
          title: log.message ? log.message.replace(/^.*:\s*/, '') : 'Validation error',
          format: log.details || 'Validation error',
          status: 'ERROR',
          recordCount: null,
          updatedAt: log.loggedAt,
        }));
      },
    },
  );

  // Dynamic resource for fetching individual dataset details reactively
  public readonly datasetDetailsResource = httpResource<DatasetRecord>(() => {
    const id = this.selectedDatasetId();
    return id ? `${this.baseUrl}/datasets/${id}` : undefined;
  });

  // Declarative resource for fetching failed validations count
  public readonly failedValidationsResource = httpResource<number>(
    () => `${this.baseUrl}/metrics/failed-validations`,
    { defaultValue: 0 },
  );

  // Refresh all httpResources so the dashboard gets fresh data immediately
  public refresh(): void {
    this.datasetsResource.reload();
    this.failedDatasetsResource.reload();
    this.failedValidationsResource.reload();
  }

  /**
   * Triggers fetching of a single dataset by ID via the reactive signal
   */
  public selectDatasetById(id: string): void {
    this.selectedDatasetId.set(id);
  }

  /**
   * Uploads a dataset file using standard HttpClient for multipart form data and progress tracking
   */
  public uploadDataset(payload: IngestionPayload): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('format', payload.format);
    formData.append('targetCollection', payload.targetCollection);

    return this.http.post<any>(`${this.baseUrl}/ingest`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json',
    });
  }
}
