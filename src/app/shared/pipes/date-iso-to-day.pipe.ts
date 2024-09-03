import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDateIsoToDay',
  standalone: true,
})
export class TransformDateIsoToDayPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(isoDateString: string): number {
    const date = new Date(isoDateString);
    return date.getDate();
  }
}
