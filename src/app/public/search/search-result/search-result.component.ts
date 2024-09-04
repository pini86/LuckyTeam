import { Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TransformDateIsoToDayPipe } from '../../../shared/pipes/date-iso-to-day.pipe';
import { TransformDateIsoToMonthPipe } from '../../../shared/pipes/date-iso-to-month.pipe';
import { TransformDateIsoToTimePipe } from '../../../shared/pipes/date-iso-to-time.pipe';
import { TransformDateIsoToWeekPipe } from '../../../shared/pipes/date-iso-to-week.pipe';
import { TransformDatePipe } from '../../../shared/pipes/date-ride.pipe';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { TravelTimePipe } from '../../../shared/pipes/travel-time.pipe';
import { StateService } from '../../../shared/services/state.service';
import { RideModelRoutesSelectedDate, SearchRoutesModel } from '../../../shared/types/search-routes.model';
import { removeTimeFromIsoDate } from '../../../shared/utils/remove-time-from-iso-date';
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
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    TransformRideCityPipe,
    TransformDateIsoToTimePipe,
    TravelTimePipe,
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit {
  protected readonly _injector = inject(Injector);
  protected readonly _searchRoutes = signal<SearchRoutesModel>(null);
  protected readonly _startDate = signal([]);
  protected readonly _selectedStartDate = signal<string>(null);
  protected readonly _rideModelRoutesSelectedDate = signal<RideModelRoutesSelectedDate[]>([]);
  protected _selectedTabIndex: number = 0;
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

    const arrDate: string[] = [];

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

        arrDate.push(removeTimeFromIsoDate(startTime));
      });
    });

    const transformDate = this._sortedUniqCurrentDate(arrDate);
    this._startDate.set(transformDate);
    this._selectedStartDate.set(transformDate[0]);

    this._onTabChange(0);
  }

  protected _onTabChange(index: number): void {
    this._selectedStartDate.set(this._startDate()[index]);

    console.log('[76] 🥕:', this._selectedStartDate());

    this._rideModelRoutesSelectedDate.set([]);

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
        schedule.segments.forEach((segment, segmentIndex) => {
          if (this._selectedStartDate() === removeTimeFromIsoDate(segment.time[0]) && segmentIndex === startIndex) {
            console.log('⭐:', segment.time[0], route.id, schedule.rideId, startIndex, endIndex);
            console.log('🍁:', schedule.rideId, schedule.segments, schedule.segments[endIndex - 1]);

            const arr = [];

            schedule.segments.forEach((segment2, segmentIndex2) => {
              if (segmentIndex2 > startIndex && segmentIndex2 <= endIndex) {
                const keys = Object.getOwnPropertyNames(segment2.price);

                keys.forEach((key) => {
                  console.log('🆘:', key, segment2.price[key]);

                  arr.push({ key });
                });
              }
            });

            const dateFrom = schedule.segments[startIndex].time[0];
            const dateTo = schedule.segments[endIndex - 1].time[1];

            if (new Date(dateFrom).getTime() > Date.now()) {
              this._addRoute(new RideModelRoutesSelectedDate(route.id, dateFrom, dateTo, route.path, segment.occupiedSeats));
            }
          }
        });
      });
    });
  }

  private _sortedUniqCurrentDate(arrDate: string[]): string[] {
    const sortedDate = arrDate.sort((a: string, b: string) => Number(new Date(a)) - Number(new Date(b)));
    const filterCurrentDate = sortedDate.filter((date) => {
      const currentDate = Date.now();
      return new Date(date).getTime() > currentDate;
    });

    return [...new Set(filterCurrentDate)];
  }

  private _addRoute(route: RideModelRoutesSelectedDate): void {
    this._rideModelRoutesSelectedDate.update((model) => [...model, route]);
  }
}
