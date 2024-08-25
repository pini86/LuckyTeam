import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDatepickerModule, MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ColoredBorderDirective } from '../../../shared/directives/colored-list-ride.directive';
import { TransformDatePipe } from '../../../shared/pipes/date-ride.pipe';
import { TransformTimePipe } from '../../../shared/pipes/time-ride.pipe';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { RouteService } from '../../../shared/services/route.service';
import { CitiesItems, RideModel, Schedule } from '../../../shared/types/routes.model';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatGridList,
    MatGridTile,
    KeyValuePipe,
    ColoredBorderDirective,
    TransformRideCityPipe,
    MatMiniFabButton,
    MatButton,
    MatIconButton,
    MatFormField,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,

    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInput,
    DatePipe,
    TransformDatePipe,
    TransformTimePipe,
  ],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
})
export class RideComponent implements OnInit {
  public readonly ride = input.required<RideModel>();
  public readonly schedule = input.required<Schedule>();
  protected readonly _city = signal<CitiesItems>(null);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _cities$ = this._routeService.getCitiesObserver();

  public ngOnInit(): void {
    this._cities$.subscribe((city) => this._city.set(city));

    console.log('[41] 🎯:', this.ride());
  }

  protected _handleChangeDate(id: number, e: any): void {
    console.log('[49] 🍄:', id, e);
  }
}
