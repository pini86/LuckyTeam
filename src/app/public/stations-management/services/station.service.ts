import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { CitiesItems, CityModel, ConnectedStation } from '../types/routes.model';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _cities = new Subject<CitiesItems>();

  // Метод для загрузки станций
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

  public addStation(stationData: { city: string; latitude: number; longitude: number; relations: number[] }): Observable<CityModel> {
    return this._http.post<CityModel>('/api/station', stationData, {
      headers: {
        Authorization: `Bearer ${this._auth.getToken()}`,
      },
    });
  }

  public deleteStation(stationId: number): Observable<void> {
    return this._http.delete<void>(`/api/station/${stationId}`, {
      headers: {
        Authorization: `Bearer ${this._auth.getToken()}`,
      },
    });
  }

  public getCitiesObserver(): Observable<CitiesItems> {
    return this._cities.asObservable();
  }
}
