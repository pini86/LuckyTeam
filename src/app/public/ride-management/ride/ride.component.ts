import { DatePipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { RideService } from '../../../shared/services/ride.service';
import { RouteService } from '../../../shared/services/route.service';
import { CitiesItems } from '../../../shared/types/routes.model';
import { SegmentItemComponent } from '../segment-item/segment-item.component';

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
    ReactiveFormsModule,
    SegmentItemComponent,
  ],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent implements OnInit {
  protected readonly _city = signal<CitiesItems>(null);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _cities$ = this._routeService.getCitiesObserver();

  private readonly _rideService: RideService = inject(RideService);
  protected readonly _currentRideId = this._rideService.currentRideId;
  protected readonly _currentRide = this._rideService.currentRide;

  private readonly _injector = inject(Injector);

  public ngOnInit(): void {
    this._cities$.subscribe((city) => {
      this._city.set(city);
    });

    effect(
      () => {
        console.log('[71] 🚀:', this._currentRideId(), this._currentRide());
      },
      { injector: this._injector },
    );
  }

  protected _handleDeleteRide(): void {
    this._rideService.deleteRide();
  }
}
