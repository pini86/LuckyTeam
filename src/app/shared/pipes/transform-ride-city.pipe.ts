import { Pipe, PipeTransform } from '@angular/core';
import { CityModel } from '../types/routes.model';

@Pipe({
  name: 'transformRideCity',
  standalone: true,
})
export class TransformRideCityPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(id: number, cities: CityModel[]): string {
    return cities.find((c) => c.id === id).city;
  }
}
