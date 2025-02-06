import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-interview-summary-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './interview-summary-popup.component.html',
  styleUrl: './interview-summary-popup.component.css'
})
export class InterviewSummaryPopupComponent implements OnInit {
  @Input() existingInterview: any | null = null;
  @Input() jobId: string = '';
  @Input() volunteerId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  interviewForm: FormGroup;

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {
    this.interviewForm = this.fb.group({
      summary: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.existingInterview) {
      this.interviewForm.patchValue({
        summary: this.existingInterview.interviewNotes
      });
    }

    document.body.style.overflow = 'hidden';
  }

  onSubmit(): void {
    if (this.interviewForm.valid) {
      const result = {
        summary: this.interviewForm.value.summary,
        jobId: this.jobId,
        volunteerId: this.volunteerId,
        isUpdate: !!this.existingInterview,
      };
      this.save.emit(result);
      this.onClose();
    } else {
      console.error('Form is invalid');
    }
  }


  onCancel(): void {
    this.onClose();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private onClose(): void {
    document.body.style.overflow = 'auto';
    this.close.emit();
  }
}
