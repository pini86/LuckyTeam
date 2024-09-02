export interface ITrip {
  rideId: number,
  carriages: string[],
  path: number[],
  schedule: Schedule[],
}

export interface Schedule {
  segments: Segments[];
}

export interface Segments {
  price: Record<string, number>;
  time: string[];
  occupiedSeats: number[];
}
