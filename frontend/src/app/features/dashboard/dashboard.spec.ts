import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';
import { MetadataApiService } from '../../core/services/metadata-api.service';
import { SupportMailService } from '../../core/services/support-mail.service';
import { signal } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MetricsGrid } from './components/metrics-grid/metrics-grid';

describe('Dashboard Component', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  let mockMetadataApiService: {
    datasetsResource: { value: any; isLoading: any };
    failedDatasetsResource: { value: any };
    failedValidationsResource: { value: any };
  };

  let mockSupportMailService: {
    handleContact: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockMetadataApiService = {
      datasetsResource: {
        value: signal([
          {
            id: 1,
            title: 'Dataset A',
            format: 'JSON',
            status: 'PROCESSED',
            recordCount: 10,
            updatedAt: '2026-06-01',
          },
          {
            id: 2,
            title: 'Dataset B',
            format: 'CSV',
            status: 'PENDING',
            recordCount: 5,
            updatedAt: '2026-06-02',
          },
        ]),
        isLoading: signal(false),
      },
      failedDatasetsResource: {
        value: signal([
          {
            id: 3,
            title: 'Dataset C',
            format: 'XML',
            status: 'FAILED',
            recordCount: 0,
            updatedAt: '2026-05-28',
          },
        ]),
      },
      failedValidationsResource: {
        value: signal(1),
      },
    };

    mockSupportMailService = {
      handleContact: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard, MetricsGrid],
      providers: [
        provideRouter([]),
        { provide: MetadataApiService, useValue: mockMetadataApiService },
        { provide: SupportMailService, useValue: mockSupportMailService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute successful and total dataset counts correctly', () => {
    expect(component.successfulCount()).toBe(1);
    expect(component.totalDatasetsCount()).toBe(2);
  });

  it('should switch active cards and update table data source via effect', () => {
    expect(component.activeCard()).toBe('success');
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].title).toBe('Dataset A');

    component.selectCard('failed');
    expect(component.activeCard()).toBe('failed');

    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].title).toBe('Dataset C');
  });

  it('should handle contact click and toggle copied signal notification', async () => {
    const mockEvent = new Event('click');

    expect(component.copied()).toBe(false);

    await component.onContactClick(mockEvent);

    expect(mockSupportMailService.handleContact).toHaveBeenCalledWith(mockEvent);
    expect(component.copied()).toBe(true);
  });

  it('should initialize MatSort correctly via ViewChild setter', () => {
    const sort = new MatSort();
    component.sort = sort;

    expect(component.dataSource.sort).toBe(sort);
    expect(sort.active).toBe('updatedAt');
    expect(sort.direction).toBe('desc');
  });
});
