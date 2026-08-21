import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MetadataApiService } from './metadata-api.service';
import { environment } from '../../../environments/environment';

describe('MetadataApiService', () => {
  let service: MetadataApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetadataApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MetadataApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are pending
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and parse datasets list successfully', () => {
    // Expect automatic httpResource request on initialization
    const req = httpMock.expectOne(`${baseUrl}/datasets`);
    expect(req.request.method).toBe('GET');

    // Mock server response containing a 'content' wrapper property
    const mockResponse = {
      content: [
        {
          id: '1',
          title: 'Test Dataset',
          format: 'MOVEBANK_XML',
          status: 'PROCESSED',
          updatedAt: '2026-08-21T12:00:00Z',
          recordCount: 10,
        },
      ],
    };
    req.flush(mockResponse);

    // Verify that the parse function correctly maps content to the resource value
    expect(service.datasetsResource.value()).toEqual(mockResponse.content);
  });

  it('should fetch dataset details dynamically when selectDatasetById is called', () => {
    // Clear the initial datasets list request queue
    const listReq = httpMock.expectOne(`${baseUrl}/datasets`);
    listReq.flush({ content: [] });

    // Also clear the metrics request queue if triggered automatically
    const metricsReq = httpMock.expectOne(`${baseUrl}/metrics/failed-validations`);
    metricsReq.flush(0);

    // Trigger dynamic selection
    service.selectDatasetById('123');

    // Expect a subsequent HTTP request for the specific ID
    const detailReq = httpMock.expectOne(`${baseUrl}/datasets/123`);
    expect(detailReq.request.method).toBe('GET');

    const mockDetail = {
      id: '123',
      title: 'Detailed Dataset',
      format: 'MOVEBANK_XML',
      status: 'PROCESSED',
      updatedAt: '2026-08-21T12:00:00Z',
      recordCount: 5,
    };
    detailReq.flush(mockDetail);

    expect(service.datasetDetailsResource.value()).toEqual(mockDetail);
  });

  it('should upload dataset payload using FormData and progress tracking', () => {
    const mockPayload = {
      file: new File(['dummy content'], 'test.xml', { type: 'application/xml' }),
      format: 'MOVEBANK_XML' as any,
      targetCollection: 'col-1',
    };

    let response: any;
    service.uploadDataset(mockPayload).subscribe((res) => {
      response = res;
    });

    const req = httpMock.expectOne(`${baseUrl}/ingest`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);

    req.flush({ status: 'uploaded' });

    expect(response).toEqual({ status: 'uploaded' });
  });

  it('should fetch failed validations count', () => {
    const req = httpMock.expectOne(`${baseUrl}/metrics/failed-validations`);
    expect(req.request.method).toBe('GET');

    req.flush(5);

    expect(service.failedValidationsResource.value()).toBe(5);
  });

  it('should trigger refresh and reload resources', () => {
    // Clear initial automatic requests on service init
    const listReq = httpMock.expectOne(`${baseUrl}/datasets`);
    listReq.flush({ content: [] });

    const metricsReq = httpMock.expectOne(`${baseUrl}/metrics/failed-validations`);
    metricsReq.flush(0);

    // Call the refresh method
    service.refresh();

    // Expect both resources to perform a reload GET request
    const reloadedListReq = httpMock.expectOne(`${baseUrl}/datasets`);
    expect(reloadedListReq.request.method).toBe('GET');
    reloadedListReq.flush({ content: [{ id: '2', title: 'Refreshed Dataset' }] });

    const reloadedMetricsReq = httpMock.expectOne(`${baseUrl}/metrics/failed-validations`);
    expect(reloadedMetricsReq.request.method).toBe('GET');
    reloadedMetricsReq.flush(2);

    expect(service.datasetsResource.value()).toEqual([{ id: '2', title: 'Refreshed Dataset' }]);
    expect(service.failedValidationsResource.value()).toBe(2);
  });
});
