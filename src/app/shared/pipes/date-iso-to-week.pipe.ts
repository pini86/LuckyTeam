import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateIsoToWeek',
  standalone: true,
})
export class TransformDateIsoToWeekPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(isoDateString: string): string {
    const date = new Date(isoDateString);
    const dayOfWeek = date.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayOfWeek];
  }
}
