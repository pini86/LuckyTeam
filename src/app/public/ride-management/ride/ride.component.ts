import { KeyValuePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { ColoredBorderDirective } from '../../../shared/directives/colored-list-ride.directive';
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
}
