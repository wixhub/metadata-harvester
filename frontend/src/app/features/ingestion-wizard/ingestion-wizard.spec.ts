import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestionWizard } from './ingestion-wizard';

describe('IngestionWizard', () => {
  let component: IngestionWizard;
  let fixture: ComponentFixture<IngestionWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngestionWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(IngestionWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
