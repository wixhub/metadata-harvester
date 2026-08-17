import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupportMailService {
  openMail(event: Event): void {
    event.preventDefault();
    const user = 'rublin';
    const domain = 'gmx.de';
    window.location.href = 'mailto:' + user + '@' + domain;
  }
}
