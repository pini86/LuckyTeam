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

export type RoutesItems = RoutesModel[];
export type CitiesItems = CityModel[];
