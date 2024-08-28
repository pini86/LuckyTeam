import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CitiesItems, CityModel, ConnectedStation, RoutesItems, RoutesModel } from '../types/routes.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _routes = new Subject<RoutesItems>();
  private readonly _cities = new Subject<CitiesItems>();

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
          this._routes.next(arrRoutes);
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
          this._cities.next(arrCities);
        },
        error: (error) => console.log(error),
      });
  }

  public getRoutesObserver(): Observable<RoutesItems> {
    return this._routes.asObservable();
  }

  public getCitiesObserver(): Observable<CitiesItems> {
    return this._cities.asObservable();
  }
}
