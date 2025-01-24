import { Pipe, PipeTransform } from '@angular/core';
import { Candidate } from '../../models/candidates.model';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {

  transform(candidates: Candidate[], filterData: { status: string[], jobId: string }): any[] {
    if (!candidates || !filterData || !filterData.status || filterData.status.length === 0) {
      return candidates;
    }

    return candidates.filter(candidate => {
      return Object.entries(candidate.jobStatuses).some(([candidateJobId, jobStatus]) => {
        return filterData.status.includes(jobStatus) && candidateJobId === filterData.jobId;
      });
    });
  }
}
