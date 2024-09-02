import { computed, Injectable, signal } from '@angular/core';
import { ICarriage, RideModel, Segments } from '../types/ride.model';
import { CitiesItems, RoutesItems, RoutesModel, StoreRoutes } from '../types/routes.model';

const initialState: StoreRoutes = {
  currentRideId: 0,
  currentRouteId: 0,
  currentRide: null,
  routes: [],
  cities: [],
  carriages: [],
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly _stateRoute = signal<StoreRoutes>(initialState);
  public readonly currentRouteId = computed<number>(() => this._stateRoute().currentRouteId);
  public readonly currentRideId = computed<number>(() => this._stateRoute().currentRideId);
  public readonly currentRide = computed<RideModel>(() => this._stateRoute().currentRide);
  public readonly cities = computed<CitiesItems>(() => this._stateRoute().cities);
  public readonly carriages = computed<ICarriage[]>(() => this._stateRoute().carriages);
  public readonly routes = computed<RoutesItems>(() => this._stateRoute().routes);

  public setCurrentRouteId(routeId: number): void {
    this._stateRoute.update((state) => ({ ...state, currentRouteId: routeId }));
  }

  public setCurrentRideId(rideId: number): void {
    this._stateRoute.update((state) => ({ ...state, currentRideId: rideId }));
  }

  public setCurrentRide(ride: RideModel): void {
    this._stateRoute.update((state) => ({ ...state, currentRide: ride }));
  }

  public setCarriages(carriages: ICarriage[]): void {
    this._stateRoute.update((state) => ({ ...state, carriages: carriages }));
  }

  public setRoutes(routes: RoutesItems): void {
    this._stateRoute.update((state) => ({ ...state, routes: routes }));
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

  public createNewRoute(route: RoutesModel): void {
    this._stateRoute.update((state) => ({
      ...state,
      routes: [...state.routes, route],
    }));
  }

  public updateRoute(routeId: number, path: number[], carriages: string[]): void {
    this._stateRoute.update((state) => ({
      ...state,
      routes: state.routes.map((route: RoutesModel): RoutesModel => {
        if (route.id === routeId) {
          return {
            id: route.id,
            carriages,
            path,
          };
        }
        return route;
      }),
    }));
  }

  public deleteRoute(routeId: number): void {
    this._stateRoute.update((state) => ({
      ...state,
      routes: state.routes.filter((route) => route.id !== routeId),
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
