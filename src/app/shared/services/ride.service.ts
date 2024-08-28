import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RideModel, Segments } from '../types/routes.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _rite = new Subject<RideModel>();

  public getRite(id: string): void {
    this._http
      .get<RideModel>(`/api/route/${id}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          const newRoute = new RideModel(data.id, data.carriages, data.path, data.schedule);
          this._rite.next(newRoute);
        },
        error: (error) => console.log(error),
      });
  }

  public updateRide(routeId: string, rideId: string, segments: Segments[]): void {
    this._http
      .put(
        `/api/route/${routeId}/ride/${rideId}`,
        {
          segments,
        },
        {
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`,
          },
        },
      )
      .subscribe({
        error: (error) => console.log(error),
      });
  }

  public updateSubjectRide(ride: RideModel): void {
    return this._rite.next(ride);
  }

  public getRideObserver(): Observable<RideModel> {
    return this._rite.asObservable();
  }
}
