import { Component, inject, signal } from '@angular/core';
import { SupportMailService } from '../../services/support-mail.service';

@Component({
  selector: 'app-support-btn',
  imports: [],
  templateUrl: './support-btn.html',
  styleUrl: './support-btn.scss',
})
export class SupportBtn {
  private mailService = inject(SupportMailService);

  // Signal to manage UI notification state
  public copied = signal<boolean>(false);

  public async onContactClick(event: Event): Promise<void> {
    const success = await this.mailService.handleContact(event);

    if (success) {
      this.copied.set(true);

      // Hide the notification after 3 seconds
      setTimeout(() => {
        this.copied.set(false);
      }, 3000);
    }
  }
}
