import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RideModel, Segments } from '../types/ride.model';
import { StoreRoutes } from '../types/routes.model';
import { AuthService } from './auth.service';

const initialState: StoreRoutes = {
  currentRideId: 0,
  currentRouteId: 0,
  currentRide: null
};

@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _ride = new Subject<RideModel>();
  private readonly _stateRoute = signal<StoreRoutes>(initialState);
  public readonly currentRouteId = computed<number>(() => this._stateRoute().currentRouteId);
  public readonly currentRideId = computed<number>(() => this._stateRoute().currentRideId);
  public readonly currentRide = computed<RideModel>(() => this._stateRoute().currentRide);

  public getRite(id: string): void {
    this._http
      .get<RideModel>(`/api/route/${id}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`
        }
      })
      .subscribe({
        next: (data) => {
          const newRoute = new RideModel(data.id, data.carriages, data.path, data.schedule);
          this._ride.next(newRoute);
        },
        error: (error) => console.log(error)
      });
  }

  public updateRide(segments: Segments[]): void {
    this._http
      .put(
        `/api/route/${this.currentRouteId()}/ride/${this.currentRideId()}`,
        {
          segments
        },
        {
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`
          }
        }
      )
      .subscribe({
        error: (error) => console.log(error)
      });
  }

  public createRide(segments: Segments[]): void {
    this._http
      .post<{ id: number }>(
        `/api/route/${this.currentRouteId()}/ride`,
        {
          segments
        },
        {
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`
          }
        }
      )
      .subscribe({
        next: (data) => {
          this._createNewRide(segments, data.id);
          this.setCurrentRideId(Number(data.id));
        },
        error: (error) => console.log(error)
      });
  }

  public deleteRide(): void {
    this._http
      .delete(`/api/route/${this.currentRouteId()}/ride/${this.currentRideId()}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`
        }
      })
      .subscribe({
        next: () => {
          this._deleteRide();
          this.setCurrentRideId(this.currentRide().schedule.find((_, index) => this.currentRide().schedule.length - 1 === index).rideId);
        },
        error: (error) => console.error(error)
      });
  }

  public setCurrentRouteId(routeId: number): void {
    this._stateRoute.update((state) => ({ ...state, currentRouteId: routeId }));
  }

  public setCurrentRideId(rideId: number): void {
    console.log('[101] 🚀:', rideId);
    this._stateRoute.update((state) => ({ ...state, currentRideId: rideId }));
  }

  public setCurrentRide(ride: RideModel): void {
    this._stateRoute.update((state) => ({ ...state, currentRide: ride }));
  }

  public getRideObserver(): Observable<RideModel> {
    return this._ride.asObservable();
  }

  private _createNewRide(segments: Segments[], rideId: number): void {
    this._stateRoute.update((state) => ({
      ...state,
      currentRide: {
        ...state.currentRide,
        schedule: [
          ...state.currentRide.schedule,
          {
            rideId,
            segments
          }
        ]
      }
    }));
  }

  private _deleteRide(): void {

    console.log('⭐:', this.currentRideId());
    this._stateRoute.update((state) => ({
      ...state,
      currentRide: {
        ...state.currentRide,
        schedule: state.currentRide.schedule.filter((schedule) => {

          console.log('🧨:', schedule.rideId, this.currentRideId());

          return schedule.rideId !== this.currentRideId();
        })
      }
    }));
  }
}
