import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ICarriage, ICarriageVM } from '../interfaces/carriages.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarriageService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);

  public carriagesFromResponseSignal = signal<ICarriageVM[]>([]);

  public getCarriages(): void {
    this._http
      .get<ICarriage[]>('/api/carriage', {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .pipe(
        map((data) => data.map((item) =>
          this.buildCarriageToVM(item))
        )
      )
      .subscribe({
        next: (data) => {
          this.carriagesFromResponseSignal.set(data);
        },
        error: (error) => console.error(error),
      });
  }

  public buildCarriageToVM = (carriage: ICarriage): ICarriageVM => {
    const { code, name, rows, leftSeats, rightSeats } = carriage;
    const rowsCount = leftSeats + rightSeats;
    const columnsCount = rows;
    const dividerIndex = rightSeats - 1;

    return {
      rows: Array.from({ length: rowsCount }).map((row, rowIndex) => {
        return Array.from({ length: columnsCount }).map((item, columnIndex) => {
          return {
            index: (rowsCount - rowIndex) + rowsCount * columnIndex,
          }
        })
      }),
      dividerIndex,
      code,
      name,
      columnsCount,
      leftSeats,
      rightSeats
    }
  }
}
