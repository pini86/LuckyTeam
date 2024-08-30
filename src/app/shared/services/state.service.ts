import { computed, Injectable, signal } from '@angular/core';
import { RideModel, Segments } from '../types/ride.model';
import { CitiesItems, StoreRoutes } from '../types/routes.model';

const initialState: StoreRoutes = {
  currentRideId: 0,
  currentRouteId: 0,
  currentRide: null,
  cities: [],
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly _stateRoute = signal<StoreRoutes>(initialState);
  public readonly currentRouteId = computed<number>(() => this._stateRoute().currentRouteId);
  public readonly currentRideId = computed<number>(() => this._stateRoute().currentRideId);
  public readonly currentRide = computed<RideModel>(() => this._stateRoute().currentRide);
  public readonly cities = computed<CitiesItems>(() => this._stateRoute().cities);

  public setCurrentRouteId(routeId: number): void {
    this._stateRoute.update((state) => ({ ...state, currentRouteId: routeId }));
  }

  public setCurrentRideId(rideId: number): void {
    this._stateRoute.update((state) => ({ ...state, currentRideId: rideId }));
  }

  public setCurrentRide(ride: RideModel): void {
    this._stateRoute.update((state) => ({ ...state, currentRide: ride }));
  }

  public addCities(cities: CitiesItems): void {
    this._stateRoute.update((state) => ({ ...state, cities: cities }));
  }

  public createNewRide(segments: Segments[], rideId: number): void {
    this._stateRoute.update((state) => ({
      ...state,
      currentRide: {
        ...state.currentRide,
        schedule: [
          ...state.currentRide.schedule,
          {
            rideId,
            segments,
          },
        ],
      },
    }));
  }

  public deleteRide(): void {
    this._stateRoute.update((state) => ({
      ...state,
      currentRide: {
        ...state.currentRide,
        schedule: state.currentRide.schedule.filter((schedule) => {
          return schedule.rideId !== this.currentRideId();
        }),
      },
    }));
  }
}
