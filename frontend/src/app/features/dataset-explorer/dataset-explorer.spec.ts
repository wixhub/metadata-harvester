import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetExplorer } from './dataset-explorer';

describe('DatasetExplorer', () => {
  let component: DatasetExplorer;
  let fixture: ComponentFixture<DatasetExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetExplorer],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetExplorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
