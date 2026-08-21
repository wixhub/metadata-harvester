import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DatasetExplorer } from './dataset-explorer';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { DatasetRecord } from '../../core/models/metadata.model';

describe('DatasetExplorer', () => {
  let component: DatasetExplorer;
  let fixture: ComponentFixture<DatasetExplorer>;

  // Mock implementation of MetadataApiService using exact types from metadata.model.ts
  const mockMetadataApiService = {
    datasetsResource: {
      value: signal<DatasetRecord[]>([
        {
          id: 'test-1',
          title: 'Test Ecological Dataset',
          format: 'MOVEBANK_XML',
          status: 'PROCESSED',
          updatedAt: '2026-08-21T12:00:00Z',
          recordCount: 42,
          validationErrors: [],
        },
      ]),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetExplorer],
      providers: [
        // Provide the typed mock service
        { provide: MetadataApiService, useValue: mockMetadataApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify that the component successfully initializes
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that datasets are correctly read from the signal resource and rendered
  it('should display datasets from the reactive resource', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.card');

    expect(cards.length).toBe(1);
    expect(compiled.textContent).toContain('Test Ecological Dataset');
    expect(compiled.textContent).toContain('MOVEBANK_XML');
  });
});
