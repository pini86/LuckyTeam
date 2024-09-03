import { ICarriage, RideModel } from './ride.model';
import { SearchRoutesModel } from './search-routes.model';

export class RoutesModel {
  constructor(
    public readonly id: number,
    public readonly carriages: string[],
    public readonly path: number[],
  ) {}
}

export class ConnectedStation {
  constructor(
    public readonly id: number,
    public readonly distance: number,
  ) {}
}

export class CityModel {
  constructor(
    public readonly id: number,
    public readonly city: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly connectedTo: ConnectedStation[],
  ) {}
}

export type RoutesItems = RoutesModel[];
export type CitiesItems = CityModel[];

export interface StoreRoutes {
  currentRouteId: number;
  currentRideId: number;
  currentRide: RideModel;
  routes: RoutesItems;
  searchRoutes: SearchRoutesModel;
  cities: CitiesItems;
  carriages: ICarriage[];
}
