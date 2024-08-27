import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ICarriage } from '../interfaces/carriages.interface';

@Injectable({
  providedIn: 'root'
})
export class CarriageService {
  public savedToken: string;
  public carriagesFromResponse = signal<ICarriage[]>([]);

  constructor(private readonly http: HttpClient, private readonly auth: AuthService,) {
    this.savedToken = localStorage.getItem('token');
    this.getCarriages();
  }

  public getCarriages(): void {
    this.http
      .get<ICarriage[]>('/api/carriage', {
        headers: {
          Authorization: `Bearer ${this.savedToken}`,
        },
      })
      .subscribe({
        next: (data) => {
          this.carriagesFromResponse.set(data);
        },
        error: (error) => console.error(error),
      });
  }
}
