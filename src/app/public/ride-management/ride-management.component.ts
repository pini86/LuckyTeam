import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RideService } from '../../shared/services/ride.service';
import { RouteService } from '../../shared/services/route.service';
import { StateService } from '../../shared/services/state.service';
import { Segments } from '../../shared/types/ride.model';
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
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _currentRideId = this._stateService.currentRideId;
  protected readonly _currentRide = this._stateService.currentRide;
  private readonly _rideService: RideService = inject(RideService);
  private readonly _location = inject(Location);

  public ngOnInit(): void {
    const id: string | null = this._activateRoute.snapshot.paramMap.get('id');

    this._stateService.setCurrentRide(null);

    if (id) {
      this._routeService.getCities();
      this._stateService.setCurrentRouteId(Number(id));
      this._rideService.getRoute(id);
    }
  }

  protected _handleBack(): void {
    this._location.back();
  }

  protected _handleChangeRide(index: number): void {
    this._stateService.setCurrentRideId(index);
  }

  protected _handleCreateRide(): void {
    const now = Date.now();

    console.log('⭐:', new Date(now).toISOString());

    const getNewPrice = (price: Record<string, number>): Record<string, number> => {
      for (const key in price) {
        if (Object.hasOwn(price, key)) {
          price[key] = 100;
        }
      }
      return price;
    };

    if (this._currentRide().schedule.length > 0) {
      const newSegment = this._currentRide().schedule[0].segments.map((segment: Segments, index) => ({
        ...segment,
        time: [new Date(now + index * 10 * 60 * 1000).toISOString(), new Date(now + (index * 10 * 60 * 1000 + 1000)).toISOString()],
        price: { ...getNewPrice(segment.price) },
      }));

      this._rideService.createRide(newSegment);
    } else {
      const newArrSegment: Segments[] = [];

      const createSegment = (index: number): Segments => {
        const originalCarriages = [...new Set(this._currentRide().carriages)];
        const carriageObject: Record<string, number> = {};
        for (const carriage of originalCarriages) {
          carriageObject[carriage] = 100;
        }
        return {
          time: [new Date(now + index * 10 * 60 * 1000).toISOString(), new Date(now + (index * 10 * 60 * 1000 + 1000)).toISOString()],
          price: carriageObject,
        };
      };

      this._currentRide().path.forEach((_, index, array) => {
        if (index < array.length - 1) {
          newArrSegment.push(createSegment(index));
        }
      });

      this._rideService.createRide(newArrSegment);
    }
  }
}
