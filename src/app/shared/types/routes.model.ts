export class RoutesModel {
  constructor(
    public readonly id: number,
    public readonly carriages: string[],
    public readonly path: number[],
  ) {}
}

export class ModifyRoutesModel {
  constructor(
    public readonly id: number,
    public readonly carriages: string[],
    public readonly path: CityModel[],
  ) {}
}

export class CityModel {
  constructor(
    public readonly id: number,
    public readonly city: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

export class RideModel {
  constructor(
    public readonly id: number,
    public readonly carriages: string[],
    public readonly path: number[],
    public readonly schedule: Schedule[],
  ) {}
}

export interface Schedule {
  readonly rideId: number;
  readonly segments: Segments[];
}

export interface Segments {
  readonly price: Record<string, number>;
  readonly time: string[];
}

export type RoutesItems = RoutesModel[];
export type CitiesItems = CityModel[];
