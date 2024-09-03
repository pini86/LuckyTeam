import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ITrip } from '../interfaces/trip.interface';
import { Observable } from 'rxjs';
import { IStations } from '../interfaces/stations.interface';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  public getTrip(rideId: string): Observable<ITrip> {
    return this._http.get<ITrip>(`/api/search/${rideId}`, {
      headers: {
        Authorization: `Bearer ${this._auth.getToken()}`,
      },
    });
  }

  public getStations(): Observable<IStations[]> {
    return this._http.get<IStations[]>('/api/station', {
        headers: {
          Authorization: `Bearer ${this._auth.token()}`,
        },
      });
    }
}
