import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { RideService } from '../../shared/services/ride.service';
import { RouteService } from '../../shared/services/route.service';
import { RideComponent } from './ride/ride.component';

@Component({
  selector: 'app-ride-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatIcon, MatIconButton, MatButton, RideComponent],
  templateUrl: './ride-management.component.html',
  styleUrl: './ride-management.component.scss',
})
export class RideManagementComponent implements OnInit {
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _rideService: RideService = inject(RideService);
  protected readonly _rides$ = this._rideService.getRideObserver();
  protected readonly _currentRideId = this._rideService.currentRideId;
  protected readonly _currentRide = this._rideService.currentRide;
  private readonly _location = inject(Location);

  public ngOnInit(): void {
    const id: string | null = this._activateRoute.snapshot.paramMap.get('id');

    if (id) {
      this._rideService.getRite(id);
      this._routeService.getCities();
      this._rideService.setCurrentRouteId(Number(id));
    }

    this._rides$.pipe(tap((ride) => console.log('🆘:', ride))).subscribe((ride) => {
      const firstRideId = ride.schedule[0].rideId;
      this._rideService.setCurrentRideId(firstRideId);
      this._rideService.setCurrentRide(ride);
    });
  }

  protected _handleBack(): void {
    this._location.back();
  }

  protected _handleChangeRide(index: number): void {
    this._rideService.setCurrentRideId(index);
  }

  protected _handleCreateRide(): void {
    const date = new Date();
    date.toISOString();

    const getNewPrice = (price: Record<string, number>): Record<string, number> => {
      for (const key in price) {
        if (Object.hasOwn(price, key)) {
          price[key] = 0;
        }
      }
      return price;
    };

    const newSegment = this._currentRide().schedule[0].segments.map((segment) => ({
      ...segment,
      time: [date.toISOString(), date.toISOString()],
      price: { ...getNewPrice(segment.price) },
    }));

    this._rideService.createRide(newSegment);
  }
}
