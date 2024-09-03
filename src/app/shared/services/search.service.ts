import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SearchRoutesModel } from '../types/search-routes.model';
import { AuthService } from './auth.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _stateService = inject(StateService);

  public getSection({
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude,
    time,
  }: {
    fromLatitude: number;
    fromLongitude: number;
    toLatitude: number;
    toLongitude: number;
    time: number;
  }): void {
    this._http
      .get<SearchRoutesModel>('/api/search', {
        params: {
          fromLatitude,
          fromLongitude,
          toLatitude,
          toLongitude,
          time,
        },
      })
      .subscribe({
        next: (data) => {
          console.log('🌻:response', data);
          const newSearchRoutes = new SearchRoutesModel(data.from, data.to, data.routes);
          this._stateService.setSearchRoutes(newSearchRoutes);
        },
        error: (error) => console.error(error),
      });
  }
}
