import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateIsoToMonth',
  standalone: true,
})
export class TransformDateIsoToMonthPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(isoDateString: string): string {
    const date = new Date(isoDateString);
    const monthIndex = date.getUTCMonth();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthIndex];
  }
}
