export interface ICarriage {
  code?: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}

export interface ISeatVM {
  index: number;
}

export interface ICarriageVM {
  code?: string;
  name: string;
  rows: ISeatVM[][];
  dividerIndex: number;
  columnsCount: number;
}
