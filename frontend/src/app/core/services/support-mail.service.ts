import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupportMailService {
  // Obfuscated email parts to prevent spam harvesting by simple bots
  private readonly user = 'rublin';
  private readonly domain = 'gmx.de';

  /**
   * Returns the fully assembled email address
   */
  public getEmail(): string {
    return `${this.user}@${this.domain}`;
  }

  /**
   * Copies the email to clipboard and optionally triggers mailto client
   */
  public async handleContact(event: Event): Promise<boolean> {
    event.preventDefault();
    const email = this.getEmail();

    try {
      // Automatically copy to clipboard
      await navigator.clipboard.writeText(email);

      // Fallback/parallel action: trigger mailto so configured clients still open
      window.location.href = `mailto:${email}`;

      return true;
    } catch (err) {
      console.error('Failed to copy email to clipboard', err);
      return false;
    }
  }
}
