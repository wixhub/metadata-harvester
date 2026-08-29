import { Component } from '@angular/core';
import { SupportBtn } from '../support-btn/support-btn';

@Component({
  selector: 'app-footer',
  imports: [SupportBtn],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
