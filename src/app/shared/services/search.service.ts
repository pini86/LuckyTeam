import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);
  private readonly _stateService = inject(StateService);


  public getSection({ fromLatitude, fromLongitude, toLatitude, toLongitude, time }: { fromLatitude: number, fromLongitude: number, toLatitude: number, toLongitude: number, time: number }): void {
    this._http
      .get('/api/search', {
        params: {
          fromLatitude,
          fromLongitude,
          toLatitude,
          toLongitude,
          time
        }
      })
      .subscribe({
        next: (data) => {
          console.log('🌻:response', data);

        },
        error: (error) => console.error(error)
      });
  }
}
