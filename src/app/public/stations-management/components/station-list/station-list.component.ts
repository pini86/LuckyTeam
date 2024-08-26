import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouteService } from '../../../../shared/services/route.service';
import { CityModel, ConnectedStation } from '../../../../shared/types/routes.model';
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

  constructor(
    private routeService: RouteService,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    // Подписка на обновления списка станций
    this.routeService.getCitiesObserver().subscribe((cities) => {
      this.stations = cities.slice(0, 5); // Присваиваем первые 5 элементов напрямую
      this.cd.detectChanges(); // Принудительно запускаем Change Detection
    });

    // Загрузка списка станций при инициализации компонента
    this.routeService.getCities();
  }

  public trackByStationId(index: number, station: CityModel): number {
    return station.id; // Уникальный идентификатор станции
  }

  // Функция trackBy для ConnectedStation (для подключенных станций)
  public trackByConnectedStationId(index: number, station: ConnectedStation): number {
    return station.id; // Уникальный идентификатор подключенной станции
  }
}
