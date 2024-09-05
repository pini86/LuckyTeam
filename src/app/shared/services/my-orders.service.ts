import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/my-orders.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersService {
  constructor(
    private _http: HttpClient,
    private _auth: AuthService,
  ) {}

  // Метод для получения списка заказов
  public getOrders(all: boolean = false): Observable<Order[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._auth.getToken()}`,
    });

    const params = all ? { all: 'true' } : {};

    return this._http.get<Order[]>('/api/order', { headers, params });
  }

  // Метод для отмены активного заказа
  public cancelOrder(orderId: number): Observable<Order> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._auth.getToken()}`,
    });

    return this._http.delete<Order>(`/api/order/${orderId}`, { headers });
  }
}
