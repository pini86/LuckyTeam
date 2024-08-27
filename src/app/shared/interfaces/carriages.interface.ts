export interface ICarriage {
  code?: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}

export interface SeatVM {
  index: number;
}

export interface CarriageVM {
  name: string;
  rows: SeatVM[][];
  dividerIndex: number;
  columnsCount: number;
}
