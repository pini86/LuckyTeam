import { Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { StateService } from '../../../shared/services/state.service';
import { SearchRoutesModel } from '../../../shared/types/search-routes.model';
import { mockObject } from '../mock-object';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  protected readonly _injector = inject(Injector);
  protected readonly _searchRoutes = signal<SearchRoutesModel>(null);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;

  public ngOnInit(): void {
    this._searchRoutes.set(mockObject);
    effect(
      () => {
        console.log('[21] 🌻:', this._searchRoutes());
      },
      { injector: this._injector },
    );
  }
}
