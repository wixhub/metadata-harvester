import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DatasetRecord, IngestionPayload } from '../models/metadata.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MetadataApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getDatasets(): Observable<DatasetRecord[]> {
    return this.http
      .get<any>(`${this.baseUrl}/datasets`)
      .pipe(map((response) => response.content || []));
  }

  uploadDataset(payload: IngestionPayload): Observable<HttpEvent<any>> {
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

  getDatasetById(id: string): Observable<DatasetRecord> {
    return this.http.get<DatasetRecord>(`${this.baseUrl}/datasets/${id}`);
  }
}
