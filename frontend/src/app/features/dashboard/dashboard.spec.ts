import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { DatasetRecord } from '../../core/models/metadata.model';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  // Mock implementation of MetadataApiService with required signals
  const mockMetadataApiService = {
    datasetsResource: {
      value: signal<DatasetRecord[]>([
        {
          id: 'test-dash-1',
          title: 'Dashboard Test Dataset',
          format: 'DWC_A',
          status: 'PROCESSED',
          updatedAt: '2026-08-21T12:00:00Z',
          recordCount: 100,
          validationErrors: [],
        },
      ]),
      isLoading: signal<boolean>(false),
    },
    failedValidationsResource: {
      value: signal<number>(2),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]), // Required for RouterLink used in the dashboard template
        { provide: MetadataApiService, useValue: mockMetadataApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify that the component successfully initializes
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that metrics and datasets are correctly rendered from signals
  it('should render dashboard metrics and dataset info', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ecological Metadata Harvester Dashboard');
    expect(compiled.textContent).toContain('Dashboard Test Dataset');
    expect(compiled.textContent).toContain('DWC_A');
  });
});
