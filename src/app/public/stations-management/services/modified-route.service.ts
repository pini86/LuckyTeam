import { inject, Injectable, Signal, signal } from '@angular/core';
import { RouteService } from '../../../shared/services/route.service';
import { CityModel, ModifyRoutesModel } from '../../../shared/types/routes.model';
import { StationService } from './station.service';

@Injectable({
  providedIn: 'root',
})
export class ModifiedRouteService {
  private readonly _stationService = inject(StationService);
  private readonly _routeService = inject(RouteService);
  private readonly _modifiedRoutesSignal = signal<ModifyRoutesModel[]>([]);

  public loadModifiedRoutes(): void {
    console.log('Method loadModifiedRoutes called');

    // Запрашиваем маршруты
    this._routeService.getRoutes(); // Добавляем вызов метода для загрузки маршрутов

    // Загружаем маршруты и станции
    this._routeService.getRoutesObserver().subscribe((routes) => {
      console.log('Loaded routes:', routes);
      this._stationService.getCitiesObserver().subscribe((stations) => {
        console.log('Loaded stations:', stations);
        const modifiedRoutes: ModifyRoutesModel[] = routes.map((route) => {
          const modifiedPath = route.path
            .map((stationId) => {
              return stations.find((station) => station.id === stationId);
            })
            .filter((station): station is CityModel => !!station); // Фильтруем undefined

          return new ModifyRoutesModel(route.id, route.carriages, modifiedPath);
        });

        console.log('Modified Routes inside service:', modifiedRoutes); // Добавлено для отладки
        // Обновляем сигнал
        this._modifiedRoutesSignal.set(modifiedRoutes);
      });
    });
  }

  public getModifiedRoutesSignal(): Signal<ModifyRoutesModel[]> {
    return this._modifiedRoutesSignal;
  }
}
