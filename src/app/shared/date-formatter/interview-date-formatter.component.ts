import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interview-date-formatter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form class="d-flex gap-2">
      <div class="form-group">
        <input
          type="date"
          class="form-control"
          [formControl]="dateControl"
          (change)="onDateTimeChange()">
      </div>
      <div class="form-group">
        <input
          type="time"
          class="form-control"
          [formControl]="timeControl"
          (change)="onDateTimeChange()">
      </div>
    </form>
  `,
  styles: [`
    .d-flex { display: flex; }
    .gap-2 { gap: 0.5rem; }
  `]
})
export class InterviewDateFormatterComponent implements OnInit, OnChanges {
  @Input() initialDate: string = '';
  @Output() dateChange = new EventEmitter<string>();

  dateControl = new FormControl();
  timeControl = new FormControl();

  ngOnInit() {
    this.updateControls();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDate']) {
      this.updateControls();
    }
  }

  private updateControls() {
    if (this.initialDate && this.initialDate.trim() !== '') {
      try {
        const date = new Date(this.initialDate);
        if (!isNaN(date.getTime())) {
          this.dateControl.setValue(this.formatDateForInput(date));
          this.timeControl.setValue(this.formatTimeForInput(date));
          return;
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
    const currentDate = new Date();
    this.dateControl.setValue(this.formatDateForInput(currentDate));
    this.timeControl.setValue(this.formatTimeForInput(currentDate));
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private formatTimeForInput(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  private formatForAPI(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  onDateTimeChange(): void {
    if (this.dateControl.value && this.timeControl.value) {
        const [year, month, day] = this.dateControl.value.split('-');
        const [hours, minutes] = this.timeControl.value.split(':');

        const combinedDateTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
        );

        console.log('Combined DateTime:', combinedDateTime);
        this.dateChange.emit(this.formatForAPI(combinedDateTime));
    }
}
}
