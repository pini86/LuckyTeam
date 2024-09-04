export class SearchRoutesStationModel {
  constructor(
    public readonly stationId: number,
    public readonly city: string,
    public readonly geolocation: {
      latitude: number;
      longitude: number;
    },
  ) {}
}

export class SearchRoutesModel {
  constructor(
    public readonly from: SearchRoutesStationModel,
    public readonly to: SearchRoutesStationModel,
    public readonly routes: RideModelSearchRoutes[],
  ) {}
}

export class RideModelSearchRoutes {
  constructor(
    public readonly id: number,
    public readonly carriages: string[],
    public readonly path: number[],
    public readonly schedule: ScheduleSearchRoutesModel[],
  ) {}
}

export interface ScheduleSearchRoutesModel {
  readonly rideId: number;
  readonly segments: SegmentsSearchRoutesModel[];
}

export interface SegmentsSearchRoutesModel {
  readonly price: Record<string, number>;
  readonly time: string[];
  readonly occupiedSeats: number[];
}

export class RideModelRoutesSelectedDate {
  constructor(
    public readonly routeId: number,
    public readonly dateFrom: string,
    public readonly dateTo: string,
    public readonly path: number[],
    public readonly occupiedSeats: number[],
  ) {}
}
