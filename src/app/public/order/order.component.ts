import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Order } from '../../shared/interfaces/my-orders.interface';
import { MyOrdersService } from '../../shared/services/my-orders.service';
import { ModifiedRouteService } from '../stations-management/services/modified-route.service';
import { StationService } from '../stations-management/services/station.service';
import { CityModel, ModifyRoutesModel } from '../stations-management/types/routes.model';

@Component({
  selector: 'app-order',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTableModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  public displayedColumns: string[] = [
    'orderID',
    'startStation',
    'startTime',
    'endStation',
    'endTime',
    'duration',
    'carriageDetails',
    'price',
    'cancel',
  ];
  public orders = new MatTableDataSource<Order>();
  public modifiedRoutes: ModifyRoutesModel[] = [];
  public stations: CityModel[] = [];

  constructor(
    private myOrdersService: MyOrdersService,
    private modifiedRouteService: ModifiedRouteService,
    private stationService: StationService,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.loadOrders();
    this.loadStations();
    this.loadModifiedRoutes();
  }

  /*
  public loadOrders(): void {
    this.myOrdersService.getOrders().subscribe(
      (data: Order[]) => {
        this.orders.data = data;
      },
      (error: Error) => {
        console.error('Error fetching orders', error);
      },
    );
  }
    */

  public loadOrders(): void {
    const mockOrders: Order[] = [
      {
        id: 1,
        rideId: 101,
        routeId: 201,
        seatId: 301,
        userId: 401,
        status: 'active',
        path: [1, 2, 3, 4],
        carriages: ['carriage_type_1', 'carriage_type_2'],
        schedule: {
          segments: [
            { start: '2024-08-08T22:19:57.708Z', end: '2024-08-09T03:19:57.708Z' },
            { start: '2024-08-09T04:19:57.708Z', end: '2024-08-09T08:19:57.708Z' },
          ],
          time: ['2024-08-08T22:19:57.708Z', '2024-08-09T08:19:57.708Z'],
        },
        price: {
          'dynamic-carriage-type-1': 100,
          'dynamic-carriage-type-2': 150,
        },
      },
      {
        id: 2,
        rideId: 102,
        routeId: 202,
        seatId: 302,
        userId: 402,
        status: 'completed',
        path: [5, 6, 7, 8],
        carriages: ['carriage_type_2', 'carriage_type_3'],
        schedule: {
          segments: [
            { start: '2024-08-10T10:00:00.000Z', end: '2024-08-10T14:00:00.000Z' },
            { start: '2024-08-10T15:00:00.000Z', end: '2024-08-10T18:00:00.000Z' },
          ],
          time: ['2024-08-10T10:00:00.000Z', '2024-08-10T18:00:00.000Z'],
        },
        price: {
          'dynamic-carriage-type-2': 120,
          'dynamic-carriage-type-3': 180,
        },
      },
    ];

    this.orders.data = mockOrders;
  }

  // Загрузка станций
  public loadStations(): void {
    this.stationService.getCitiesObserver().subscribe((cities) => {
      this.stations = cities;
      this.cd.detectChanges();
    });

    // Загрузка списка станций при инициализации компонента
    this.stationService.getCities();
  }

  public cancelOrder(orderId: number): void {
    // Implement cancellation logic here
    console.log('Cancelling order ID:', orderId);
  }

  public calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  }

  public calculateTotalPrice(price: Record<string, number>): number {
    // Подсчитываем сумму всех цен
    return Object.values(price).reduce((total, currentPrice) => total + currentPrice, 0);
  }

  // Загрузка модифицированных маршрутов (с информацией о станциях)
  public loadModifiedRoutes(): void {
    this.modifiedRouteService.getModifiedRoutes().subscribe((routes) => {
      this.modifiedRoutes = routes;
      this.cd.detectChanges();
    });
  }

  // Метод для получения названия станции по ID
  public getStationNameById(stationId: number): string {
    // Поиск станции в загруженных маршрутах
    for (const route of this.modifiedRoutes) {
      const foundStation = route.path.find((city) => city.id === stationId);
      if (foundStation) {
        return foundStation.city;
      }
    }

    // Если станция не найдена в маршрутах, ищем среди всех станций
    const station = this.stations.find((city) => city.id === stationId);
    return station ? station.city : 'Unknown Station';
  }
}
