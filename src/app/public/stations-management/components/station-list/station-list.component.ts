import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CityModel, ConnectedStation, ModifyRoutesModel } from '../../../../shared/types/routes.model';
import { ModifiedRouteService } from '../../services/modified-route.service';
import { StationService } from '../../services/station.service';
import { ConnectedStationsComponent } from '../connected-stations/connected-stations.component';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ConnectedStationsComponent, MatListModule],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss',
})
export class StationListComponent implements OnInit {
  public stations: CityModel[] = []; // Массив для хранения станций
  public modifiedRoutes: ModifyRoutesModel[] = []; // Массив для хранения модифицированных маршрутов

  constructor(
    private stationService: StationService,
    private modifiedRouteService: ModifiedRouteService,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // Подписка на обновления списка станций
    this.stationService.getCitiesObserver().subscribe((cities) => {
      this.stations = cities.slice(0, 5); // Присваиваем первые 5 элементов напрямую
      this.cd.detectChanges(); // Принудительно запускаем Change Detection
    });

    // Загружаем модифицированные маршруты при инициализации компонента
    this.modifiedRouteService.loadModifiedRoutes();

    // Проверяем обновление сигнала напрямую
    setTimeout(() => {
      this.modifiedRoutes = this.modifiedRouteService.getModifiedRoutesSignal()();
      console.log('Modified Routes:', this.modifiedRoutes);

      if (this.modifiedRoutes.length > 0) {
        const cityNames = this.modifiedRoutes.flatMap((route) => route.path.map((city) => city.city));
        console.log('City Names:', cityNames);
      }

      this.cd.detectChanges();
    }, 1000); // Задержка для ожидания загрузки данных

    // Загрузка списка станций при инициализации компонента
    this.stationService.getCities();
  }

  public trackByStationId(index: number, station: CityModel): number {
    return station.id; // Уникальный идентификатор станции
  }

  // Функция trackBy для ConnectedStation (для подключенных станций)
  public trackByConnectedStationId(index: number, station: ConnectedStation): number {
    return station.id; // Уникальный идентификатор подключенной станции
  }

  // Функция trackBy для маршрутов (для модифицированных маршрутов)
  public trackByModifiedRouteId(index: number, route: ModifyRoutesModel): number {
    return route.id; // Уникальный идентификатор модифицированного маршрута
  }

  public getRoutesForStation(station: CityModel): ModifyRoutesModel[] {
    return this.modifiedRoutes.filter((route) => route.path.some((city) => city.id === station.id));
  }
}
