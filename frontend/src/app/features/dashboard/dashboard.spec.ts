import { Dashboard } from './dashboard';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;
  let mockApiService: any;

  beforeEach(async () => {
    mockApiService = {
      datasetsResource: {
        value: signal([
          { id: '1', status: 'PROCESSED', updatedAt: '2026-01-01' },
          { id: '2', status: 'FAILED', updatedAt: '2026-01-02' },
        ]),
        isLoading: signal(false),
      },
      failedDatasetsResource: {
        value: signal([{ id: '3', status: 'ERROR', updatedAt: '2026-01-03' }]),
      },
      failedValidationsResource: {
        value: signal(1),
      },
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), { provide: MetadataApiService, useValue: mockApiService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.displayedColumns).toEqual([
      'id',
      'title',
      'format',
      'status',
      'recordCount',
      'updatedAt',
    ]);
    expect(component.wakeUpCountdown()).toBe(150);
    expect(component.activeCard()).toBe('success');
  });

  it('should compute successful count correctly', () => {
    expect(component.successfulCount()).toBe(1);
  });

  it('should compute total datasets count correctly', () => {
    expect(component.totalDatasetsCount()).toBe(2);
  });

  it('should change active card and update data source', () => {
    component.selectCard('failed');
    fixture.detectChanges();
    expect(component.activeCard()).toBe('failed');
    expect(component.dataSource.data).toEqual([
      { id: '3', status: 'ERROR', updatedAt: '2026-01-03' },
    ]);
  });

  it('should filter success datasets when success card is selected', () => {
    component.selectCard('success');
    fixture.detectChanges();
    expect(component.dataSource.data).toEqual([
      { id: '1', status: 'PROCESSED', updatedAt: '2026-01-01' },
    ]);
  });
});
