import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { CandidateService } from '../../../services/candidates.service';

@Component({
  selector: 'app-add-new-candidate-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-candidate-popup.component.html',
  styleUrls: ['./add-new-candidate-popup.component.css'],
})
export class AddNewCandidatePopupComponent {
  @Output() closePopup = new EventEmitter<void>();
  @Output() candidateAdded = new EventEmitter<void>();

  soldierName: string = '';
  soldierId: string = '';
  soldierEmail: string = '';
  soldierPhone: string = '';
  message: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private candidateService: CandidateService) {}

  addSoldier(event: Event) {
    event.preventDefault();

    if (this.soldierName && this.soldierId && this.soldierEmail && this.soldierPhone) {
      this.isLoading = true;
      this.error = null;

      const candidateData = {
        full_name: this.soldierName,
        national_id: this.soldierId,
        email: this.soldierEmail,
        phone: this.soldierPhone
      };

      this.candidateService.createCandidate(candidateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message = 'החייל נוסף בהצלחה';
          setTimeout(() => {
            this.candidateAdded.emit();
            this.close();
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message || 'הוספת המועמד נכשלה. אנא נסה שוב.';
        }
      });
    }
  }

  close() {
    this.closePopup.emit();
  }
}
