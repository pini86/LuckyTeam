import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RideModel, Segments } from '../types/ride.model';
import { AuthService } from './auth.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _stateService = inject(StateService);
  protected readonly _currentRide = this._stateService.currentRide;
  protected readonly _currentRideId = this._stateService.currentRideId;
  protected readonly _currentRouteId = this._stateService.currentRouteId;

  public getRoute(id: string): void {
    this._http
      .get<RideModel>(`/api/route/${id}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          const newRoute = new RideModel(data.id, data.carriages, data.path, data.schedule);
          this._stateService.setCurrentRide(newRoute);
          this._stateService.setCurrentRideId(newRoute.schedule[0].rideId);
        },
        error: (error) => console.log(error),
      });
  }

  public updateRide(segments: Segments[]): void {
    this._http
      .put(
        `/api/route/${this._currentRouteId()}/ride/${this._currentRideId()}`,
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

  public createRide(segments: Segments[]): void {
    this._http
      .post<{ id: number }>(
        `/api/route/${this._currentRouteId()}/ride`,
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
        next: (data) => {
          this._stateService.createNewRide(segments, data.id);
          this._stateService.setCurrentRideId(Number(data.id));
        },
        error: (error) => console.log(error),
      });
  }

  public deleteRide(): void {
    this._http
      .delete(`/api/route/${this._currentRouteId()}/ride/${this._currentRideId()}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: () => {
          this._stateService.deleteRide();
          this._stateService.setCurrentRideId(
            this._currentRide().schedule.find((_, index) => this._currentRide().schedule.length - 1 === index).rideId,
          );
        },
        error: (error) => console.error(error),
      });
  }
}
