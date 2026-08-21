import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IngestionWizard } from './ingestion-wizard';
import { MetadataApiService } from '../../core/services/metadata-api.service';

describe('IngestionWizard', () => {
  let component: IngestionWizard;
  let fixture: ComponentFixture<IngestionWizard>;

  // Mock implementation of MetadataApiService
  const mockMetadataApiService = {
    refresh: () => {},
    uploadDataset: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngestionWizard],
      providers: [
        provideRouter([]), // Required for Router and RouterLink
        { provide: MetadataApiService, useValue: mockMetadataApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form values and signals', () => {
    expect(component.form.value.format).toBe('MOVEBANK_XML');
    expect(component.uploading()).toBe(false);
    expect(component.uploadProgress()).toBe(0);
    expect(component.selectedFile()).toBeNull();
  });
});
