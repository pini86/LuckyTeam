import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RouteService } from '../../../shared/services/route.service';
import { CityModel, ModifyRoutesModel } from '../../../shared/types/routes.model';
import { StationService } from './station.service';

@Injectable({
  providedIn: 'root',
})
export class ModifiedRouteService {
  private readonly _stationService = inject(StationService);
  private readonly _routeService = inject(RouteService);
  private readonly _modifiedRoutesSubject = new BehaviorSubject<ModifyRoutesModel[]>([]); // Используем BehaviorSubject с начальным значением

  public loadModifiedRoutes(): void {
    //console.log('Method loadModifiedRoutes called');

    // Запрашиваем маршруты
    this._routeService.getRoutes(); // Добавляем вызов метода для загрузки маршрутов

    // Загружаем маршруты и станции
    this._routeService.getRoutesObserver().subscribe((routes) => {
      //console.log('Loaded routes:', routes);
      this._stationService.getCitiesObserver().subscribe((stations) => {
        //console.log('Loaded stations:', stations);
        const modifiedRoutes: ModifyRoutesModel[] = routes.map((route) => {
          const modifiedPath = route.path
            .map((stationId) => {
              return stations.find((station) => station.id === stationId);
            })
            .filter((station): station is CityModel => !!station); // Фильтруем undefined

          return new ModifyRoutesModel(route.id, route.carriages, modifiedPath);
        });

        //console.log('Modified Routes inside service:', modifiedRoutes);
        this._modifiedRoutesSubject.next(modifiedRoutes);
      });
    });
  }

  public getModifiedRoutes(): Observable<ModifyRoutesModel[]> {
    return this._modifiedRoutesSubject.asObservable();
  }
}
