import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateIsoToTime',
  standalone: true,
})
export class TransformDateIsoToTimePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(isoDateString: string): string {
    const date = new Date(isoDateString);
    const minutes = date.getUTCMinutes() > 9 ? date.getUTCMinutes() : `0${date.getUTCMinutes()}`;
    const hours = date.getUTCHours() > 9 ? date.getUTCHours() : `0${date.getUTCHours()}`;
    return `${hours}:${minutes}`;
  }
}
