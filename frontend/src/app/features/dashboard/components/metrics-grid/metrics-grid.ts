import { Component, input, output } from '@angular/core';
import { CardType } from '../../../../core/models/metadata.model';

@Component({
  selector: 'app-metrics-grid',
  templateUrl: './metrics-grid.html',
  styleUrl: './metrics-grid.scss',
})
export class MetricsGrid {
  // Input signals bound to parent metrics
  readonly totalDatasetsCount = input.required<number>();
  readonly successfulCount = input.required<number>();
  readonly failedValidationsCount = input.required<number | null>();

  // Current active card state input
  readonly activeCard = input.required<CardType>();

  // Output event emitter for card selection
  readonly cardSelected = output<CardType>();

  // Handle card click and emit selected type upwards
  protected onSelectCard(cardType: CardType): void {
    this.cardSelected.emit(cardType);
  }
}
