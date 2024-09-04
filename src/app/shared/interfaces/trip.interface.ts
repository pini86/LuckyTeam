
export interface ITrip {
  rideId: number,
  carriages: string[],
  path: number[],
  schedule: Schedule,
}

export interface Schedule {
  segments: Segments[];
}

export interface Segments {
  price: Record<string, number>;
  time: string[];
  occupiedSeats: number[];
}

export interface ITripVM {
  rideId: number,
  firstCityName: string;
  lastCityName: string;
  departureDate: string;
  arrivalDate: string;
  carriages: ICarriagesVM[];
  uniqueCarriages?: IUniqueCarriages[];
}
export interface ICarriagesVM {
  number: number;
  name: string;
  type: string;
  occupiedSeats: number;
  price: number;
  countSeats: number,
}
export interface IUniqueCarriages {
  type: string;
  occupiedSeats: number;
  price: number;
  countSeats: number,
}
