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

export interface ICarriage {
  code?: string;
  name: string;
  rows: number;
  leftSeats?: number;
  rightSeats?: number;
}
