import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-formatter',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <form>
  <div class="form-group">
    <input type="date" id="date" class="form-control" [value]="dateControl.value" (change)="onDateChange($event)">
  </div>
  </form>
  `
})
export class DateFormatterComponent implements OnInit, OnChanges {
  @Input() initialDate: string = '';
  @Output() dateChange = new EventEmitter<string>();

  dateControl = new FormControl();

  ngOnInit() {
    this.updateDateControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDate']) {
      this.updateDateControl();
    }
  }

  private updateDateControl() {
    if (this.initialDate && this.initialDate.trim() !== '') {
      try {
        const date = new Date(this.initialDate);
        if (!isNaN(date.getTime())) {
          const formattedDate = this.formatDateForInput(date);
          this.dateControl.setValue(formattedDate);
          return;
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
    const currentDate = new Date();
    const formattedDate = this.formatDateForInput(currentDate);
    this.dateControl.setValue(formattedDate);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private formatDateForAPI(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];  // Use the 3-letter abbreviation of the month
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: any): void {
    const date: Date = new Date(event.target.value);
    const formattedDate: string = this.formatDateForAPI(date);  // Format the date as YYYY-MMM-DD
    console.log(formattedDate);
    this.dateChange.emit(formattedDate); // Emit the formatted date
  }
}
