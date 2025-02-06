import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-job-details-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './job-details-bar.component.html',
  styleUrls: ['./job-details-bar.component.css']
})
export class JobDetailsBarComponent implements OnInit, OnDestroy {
  @Input() jobId: string = '';
  isMainActive: boolean = false;
  isCandidatesActive: boolean = false;
  isPreferableActive: boolean = false;

  private routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateActiveState();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveState();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateActiveState() {
    const currentUrl = this.router.url;
    this.isMainActive = currentUrl === '/' || /\/job-details(\/\d+)?$/.test(currentUrl);
    this.isCandidatesActive = /\/job-details\/\d+\/candidates$/.test(currentUrl);
    this.isPreferableActive = /\/job-details\/\d+\/candidates\/preferred$/.test(currentUrl);
  }

  goToCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates`]);
  }

  gotToPreferableCandidates() {
    this.router.navigate([`/job-details/${this.jobId}/candidates/preferred`]);
  }

  goBack() {
    this.router.navigate(['/open-jobs']);
  }
}
