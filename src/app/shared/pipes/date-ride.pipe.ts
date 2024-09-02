import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformDate',
  standalone: true,
})
export class TransformDatePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
