import { Component, signal, OnInit, OnDestroy, input } from '@angular/core';
import animalFactsData from '../../../../../public/data/animal-facts.json';
import { AnimalFact } from '../../models/metadata.model';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit, OnDestroy {
  // Receive countdown timer value from parent component using signals
  readonly wakeUpCountdown = input<number>(150);

  // Load telemetry fun facts from the external JSON file
  readonly facts = signal<AnimalFact[]>(animalFactsData as AnimalFact[]);

  // Index of the currently active fun fact card
  readonly currentIndex = signal<number>(0);

  private intervalId: any;

  ngOnInit(): void {
    // Rotate cards every 25 seconds to seamlessly cover the total 150-second countdown duration
    this.intervalId = setInterval(() => {
      this.currentIndex.update((index) => (index + 1) % this.facts().length);
    }, 25000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
