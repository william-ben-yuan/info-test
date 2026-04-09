import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrls: ['./alert.css'],
})
export class AlertComponent {
  @Input() message: string | null = null;
  @Input() type: 'error' | 'success' = 'error';
  @Output() close = new EventEmitter<void>();
}
