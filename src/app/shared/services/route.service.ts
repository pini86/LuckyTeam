import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICarriage } from '../types/ride.model';
import { CitiesItems, CityModel, ConnectedStation, RoutesItems, RoutesModel } from '../types/routes.model';
import { AuthService } from './auth.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _stateService = inject(StateService);

  public getRoutes(): void {
    this._http
      .get<RoutesItems>('/api/route', {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          const arrRoutes: RoutesItems = [];
          data.forEach((item) => {
            const newItem = new RoutesModel(item.id, item.carriages, item.path);
            arrRoutes.push(newItem);
          });
          this._stateService.setRoutes(arrRoutes);
        },
        error: (error) => console.error(error),
      });
  }

  public createRoute(path: number[], carriages: string[]): void {
    this._http
      .post<{ id: number }>(
        '/api/route',
        {
          path,
          carriages,
        },
        {
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`,
          },
        },
      )
      .subscribe({
        next: (data) => {
          this._stateService.createNewRoute({
            id: data.id,
            path,
            carriages,
          });
        },
        error: (error) => console.error(error),
      });
  }

  public updateRoute(path: number[], carriages: string[], routeId: number): void {
    this._http
      .put<{ id: number }>(
        `/api/route/${routeId}`,
        {
          path,
          carriages,
        },
        {
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`,
          },
        },
      )
      .subscribe({
        next: (data) => {
          this._stateService.updateRoute(routeId, path, carriages);
        },
        error: (error) => console.error(error),
      });
  }

  public deleteRoute(routeId: string): void {
    this._http
      .delete(`/api/route/${routeId}`, {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          this._stateService.deleteRoute(Number(routeId));
        },
        error: (error) => console.log(error),
      });
  }

  public getCities(): void {
    this._http
      .get<CitiesItems>('/api/station', {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          const arrCities: CitiesItems = [];
          data.forEach((city) => {
            // Проверяем, есть ли данные по connectedTo и преобразуем их
            const connectedStations = city.connectedTo
              ? city.connectedTo.map((connection) => new ConnectedStation(connection.id, connection.distance))
              : [];
            const newCity = new CityModel(city.id, city.city, city.latitude, city.longitude, connectedStations);
            arrCities.push(newCity);
          });
          this._stateService.addCities(arrCities);
        },
        error: (error) => console.error(error),
      });
  }

  public getCarriages(): void {
    this._http
      .get<ICarriage[]>('/api/carriage', {
        headers: {
          Authorization: `Bearer ${this._auth.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          this._stateService.setCarriages(data);
        },
        error: (error) => console.error(error),
      });
  }
}
