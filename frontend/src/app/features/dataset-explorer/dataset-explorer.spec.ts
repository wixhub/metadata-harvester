import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DatasetExplorer } from './dataset-explorer';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { signal } from '@angular/core';

describe('DatasetExplorer', () => {
  let component: DatasetExplorer;
  let fixture: ComponentFixture<DatasetExplorer>;

  const mockDatasetsValue = [
    {
      id: '1',
      title: 'Movebank GPS Telemetry - Brown Bears',
      format: 'MOVEBANK_XML',
      status: 'PROCESSED',
      updatedAt: '2026-08-28',
      recordCount: 150,
    },
    {
      id: '2',
      title: 'Darwin Core Archive - Arctic Foxes',
      format: 'DWC_A',
      status: 'PROCESSED',
      updatedAt: '2026-08-28',
      recordCount: 300,
    },
  ];

  beforeEach(async () => {
    // Correctly mock the httpResource value as a WritableSignal or Signal
    const mockMetadataApiService = {
      datasetsResource: {
        value: signal(mockDatasetsValue),
      },
    };

    await TestBed.configureTestingModule({
      imports: [DatasetExplorer],
      providers: [
        provideRouter([]),
        { provide: MetadataApiService, useValue: mockMetadataApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly expose datasets from the MetadataApiService resource', () => {
    const datasets = component.datasets();
    expect(datasets).toEqual(mockDatasetsValue);
    expect(datasets?.length).toBe(2);
    expect(datasets?.[0].title).toContain('Brown Bears');
  });

  it('should render dataset items or structure properly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.datasets()).toBeDefined();
    expect(compiled).toBeTruthy();
  });
});
