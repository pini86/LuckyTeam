import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTime',
  standalone: true,
})
export class TransformTimePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(date: string): string {
    console.log('[10] 🐬:', date);
    const d = new Date(date);
    const minutes = d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`;
    return `${d.getHours()}:${minutes}`;
  }
}
