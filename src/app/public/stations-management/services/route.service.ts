import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { RideModel, RoutesItems, RoutesModel } from '../types/routes.model';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _routes = new Subject<RoutesItems>();

  private readonly _route = new Subject<RideModel>();

  private readonly _count = signal<number>(0);

  public increment(): void {
    this._count.update(() => this._count() + 1);
  }

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
          this._route.next(newRoute);
        },
        error: (error) => console.log(error),
      });
  }

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

  public getRoutesObserver(): Observable<RoutesItems> {
    return this._routes.asObservable();
  }

  public getRouteObserver(): Observable<RideModel> {
    return this._route.asObservable();
  }
}
