import { Component, effect, inject, Injector, OnInit, signal, WritableSignal } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TransformDateIsoToDayPipe } from '../../../shared/pipes/date-iso-to-day.pipe';
import { TransformDateIsoToMonthPipe } from '../../../shared/pipes/date-iso-to-month.pipe';
import { TransformDateIsoToWeekPipe } from '../../../shared/pipes/date-iso-to-week.pipe';
import { TransformDatePipe } from '../../../shared/pipes/date-ride.pipe';
import { StateService } from '../../../shared/services/state.service';
import { SearchRoutesModel } from '../../../shared/types/search-routes.model';
import { mockObject } from '../mock-object';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [
    TransformDatePipe,
    TransformDateIsoToMonthPipe,
    TransformDateIsoToDayPipe,
    TransformDateIsoToWeekPipe,
    MatTabGroup,
    MatTab,
    MatTabLabel,
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  protected readonly _injector = inject(Injector);
  protected readonly _searchRoutes = signal<SearchRoutesModel>(null);
  protected readonly _startDate = signal([]);
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

    this._searchRoutes().routes.forEach((route, indexRoute) => {
      let startIndex = 0;
      let endIndex = 0;
      route.path.forEach((p, i) => {
        if (p === this._searchRoutes().from.stationId) {
          startIndex = i;
        }

        if (p === this._searchRoutes().to.stationId) {
          endIndex = i;
        }
      });

      route.schedule.forEach((schedule) => {
        const startTime = schedule.segments[startIndex].time[0];
        const endTime = schedule.segments[endIndex - 1].time[1];

        this._startDate.update((dates) => [...dates, startTime]);

        console.log('[44] 🎯:start', indexRoute, startTime);
        console.log('[46] 🚧:end', indexRoute, endTime);
      });

      this._sortedDate(this._startDate);
    });

    console.log('✅:', this._startDate());
  }

  protected _getTabs(month: string, day: number, week: string): string {
    return `${month} ${day} ${week}`;
  }

  private _sortedDate(s: WritableSignal<string[]>): void {
    return s.update((d: string[]) => d.sort((a: string, b: string) => Number(new Date(a)) - Number(new Date(b))));
  }
}
