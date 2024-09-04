import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'travelTime',
  standalone: true,
})
export class TravelTimePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(isoDateStringFrom: string, isoDateStringTo: string): string {
    const dateFrom = new Date(isoDateStringFrom);
    const dateTo = new Date(isoDateStringTo);

    const timeDifference = Math.abs(dateTo.getTime() - dateFrom.getTime());
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
}
