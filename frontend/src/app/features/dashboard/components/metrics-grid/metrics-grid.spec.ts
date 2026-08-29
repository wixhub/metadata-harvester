import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricsGrid } from './metrics-grid';
import { Component } from '@angular/core';
import { CardType } from '../../../../core/models/metadata.model';

@Component({
  template: `
    <app-metrics-grid
      [totalDatasetsCount]="totalCount"
      [successfulCount]="successCount"
      [failedValidationsCount]="failedCount"
      [activeCard]="active"
      (cardSelected)="onCardSelected($event)"
    />
  `,
  imports: [MetricsGrid],
})
class TestHostComponent {
  totalCount = 10;
  successCount = 7;
  failedCount = 3;
  active: CardType = 'success';
  selectedCard: CardType | null = null;

  onCardSelected(card: CardType): void {
    this.selectedCard = card;
  }
}

describe('MetricsGrid Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let metricsGridElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    metricsGridElement = fixture.nativeElement;
  });

  it('should create the metrics grid component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display correct metric values in the DOM', () => {
    const values = metricsGridElement.querySelectorAll('.metric-value');

    expect(values.length).toBe(3);
    expect(values[0].textContent?.trim()).toBe('10');
    expect(values[1].textContent?.trim()).toBe('7');
    expect(values[2].textContent?.trim()).toBe('3');
  });

  it('should apply active class based on activeCard input', () => {
    const cards = metricsGridElement.querySelectorAll('.card');

    expect(cards[1].classList.contains('active')).toBe(true);
    expect(cards[0].classList.contains('active')).toBe(false);
    expect(cards[2].classList.contains('active')).toBe(false);
  });

  it('should emit cardSelected event when a card is clicked', () => {
    const cards = metricsGridElement.querySelectorAll('.card');

    (cards[0] as HTMLElement).click();
    fixture.detectChanges();

    expect(hostComponent.selectedCard).toBe('total');

    (cards[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(hostComponent.selectedCard).toBe('failed');
  });
});
