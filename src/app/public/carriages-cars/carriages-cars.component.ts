import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-carriages-cars',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './carriages-cars.component.html',
  styleUrl: './carriages-cars.component.scss',
})
export class CarriagesCarsComponent {}
