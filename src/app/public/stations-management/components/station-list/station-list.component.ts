import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CityModel, ConnectedStation, ModifyRoutesModel } from '../../../../shared/types/routes.model';
import { ModifiedRouteService } from '../../services/modified-route.service';
import { StationService } from '../../services/station.service';
import { ConnectedStationsComponent } from '../connected-stations/connected-stations.component';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ConnectedStationsComponent, MatListModule, MatPaginatorModule],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss',
})
export class StationListComponent implements OnInit {
  public stations: CityModel[] = []; // Массив для хранения станций
  public modifiedRoutes: ModifyRoutesModel[] = []; // Массив для хранения модифицированных маршрутов

  public paginationAllStations: CityModel[] = []; // Весь список станций, инициализируется вашими данными
  public paginatedStations: CityModel[] = []; // Станции на текущей странице
  public pageSize = 10; // Количество станций на одной странице по умолчанию
  public currentPage = 0;

  constructor(
    private stationService: StationService,
    private modifiedRouteService: ModifiedRouteService,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // Подписка на обновления списка станций
    this.stationService.getCitiesObserver().subscribe((cities) => {
      //this.stations = cities.slice(0, 5); // Присваиваем первые 5 элементов напрямую
      this.stations = cities;
      this.cd.detectChanges(); // Принудительно запускаем Change Detection
      this.paginateStations();
    });

    // Загружаем модифицированные маршруты при инициализации компонента
    this.modifiedRouteService.loadModifiedRoutes();

    // Подписка на обновления модифицированных маршрутов
    this.modifiedRouteService.getModifiedRoutes().subscribe((routes) => {
      this.modifiedRoutes = routes;
      //console.log('Modified Routes:', this.modifiedRoutes);
      this.cd.detectChanges();
    });

    // Загрузка списка станций при инициализации компонента
    this.stationService.getCities();

    this.paginateStations();
  }

  public trackByListStationId(index: number, station: CityModel): number {
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
    const routesForStation = this.modifiedRoutes
      .filter((route) => route.path.some((city) => city.id === station.id))
      .map((route) => {
        const filteredRoute = {
          ...route,
          path: route.path.filter((city) => city.id !== station.id),
        };

        // Логируем станции, связанные с текущей станцией
        console.log(
          `Routes for station ${station.city}:`,
          filteredRoute.path.map((city) => city.city),
        );

        return filteredRoute;
      });

    // Логируем маршруты, возвращенные для текущей станции
    console.log(`Filtered routes for station ${station.city}:`, routesForStation);

    return routesForStation;
  }

  public getConnectedStationsWithNames(currentStation: CityModel): CityModel[] {
    return currentStation.connectedTo
      .map((connected) => {
        for (const route of this.modifiedRoutes) {
          const foundStation = route.path.find((city) => city.id === connected.id);
          if (foundStation) {
            return foundStation; // Возвращаем найденную станцию
          }
        }
        return null; // Возвращаем null, если станция не найдена
      })
      .filter((station): station is CityModel => station !== null);
  }

  public paginateStations(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Проверка на выход за пределы массива
    if (startIndex > this.stations.length) {
      this.currentPage = 0;
    }

    this.paginatedStations = this.stations.slice(startIndex, endIndex);
  }

  public onPageChange(event: PageEvent): void {
    // Обновляем размер страницы
    this.pageSize = event.pageSize;

    // Проверяем, чтобы текущая страница не выходила за границы
    this.currentPage = event.pageIndex;

    this.paginateStations();
  }
}
