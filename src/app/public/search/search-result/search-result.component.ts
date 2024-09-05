import { Component, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
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
import { Router } from '@angular/router';

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
    TravelTimePipe
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss'
})
export class SearchResultComponent implements OnChanges {
  public readonly initialStartTimestamp = input.required<number>();
  public readonly searchRoutes = input.required<SearchRoutesModel>();
  protected readonly _startDate = signal([]);
  protected readonly _selectedStartDate = signal<string>(null);
  protected _selectedTabIndex: number = 0;
  protected readonly _rideModelRoutesSelectedDate = signal<RideModelRoutesSelectedDate[]>([]);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;
  private readonly _router = inject(Router);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchRoutes']) {
      this._initTabs();
    }
  }

  protected _onTabChange(index: number): void {
    this._selectedStartDate.set(this._startDate()[index]);

    this._rideModelRoutesSelectedDate.set([]);


    this.searchRoutes().routes.forEach((route) => {
      let startIndex = 0;
      let endIndex = 0;
      route.path.forEach((p, i) => {
        if (p === this.searchRoutes().from.stationId) {
          startIndex = i;
        }

        if (p === this.searchRoutes().to.stationId) {
          endIndex = i;
        }
      });

      route.schedule.forEach((schedule) => {
        schedule.segments.forEach((segment, segmentIndex) => {
          if (this._selectedStartDate() === removeTimeFromIsoDate(segment.time[0]) && segmentIndex === startIndex) {
            // console.log('⭐:', segment.time[0], route.id, schedule.rideId, startIndex, endIndex);
            // console.log('🍁:', schedule.rideId, schedule.segments, schedule.segments[endIndex - 1]);

            const arr = [];
            schedule.segments.forEach((segment2, segmentIndex2) => {
              if (segmentIndex2 > startIndex && segmentIndex2 <= endIndex) {
                const keys = Object.getOwnPropertyNames(segment2.price);

                keys.forEach((key) => {
                  // console.log('🆘:', key, segment2.price[key]);

                  arr.push({ key });
                });
              }
            });

            const dateFrom = schedule.segments[startIndex].time[0];
            const dateTo = schedule.segments[endIndex - 1].time[1];

            if (this._getDateUTCTimestamp(dateFrom) > this.initialStartTimestamp()) {
              this._addRoute(new RideModelRoutesSelectedDate(route.id, dateFrom, dateTo, route.path, segment.occupiedSeats));
            }
          }
        });
      });
    });

    this._selectedTabIndex = index;
  }

  protected _handleClickCard(routeId: number): void {
    const from = this.searchRoutes().from.stationId;
    const to = this.searchRoutes().to.stationId;
    this._router.navigateByUrl(`trip/${routeId}?from=${from}&to=${to}`);
  }

  private _getDateUTCTimestamp(date: string): number {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    const hours = d.getUTCHours();
    const minutes = d.getUTCMinutes();

    return new Date(year, month, day, hours, minutes).getTime();
  }

  private _initTabs(): void {
    this._startDate.set([]);
    this._selectedStartDate.set(null);

    const arrDate: string[] = [];
    this.searchRoutes().routes.forEach((route) => {
      let startIndex = 0;
      route.path.forEach((p, i) => {
        if (p === this.searchRoutes().from.stationId) {
          startIndex = i;
        }
      });

      route.schedule.forEach((schedule) => {
        const startTime = schedule.segments[startIndex].time[0];
        arrDate.push(startTime);
      });
    });

    const transformDate = this._sortedUniqCurrentDate(arrDate);
    this._startDate.set(transformDate);
    this._selectedStartDate.set(transformDate[0]);

    this._onTabChange(0);
  }

  private _sortedUniqCurrentDate(arrDate: string[]): string[] {
    const sortedDate = arrDate.sort((a: string, b: string) => Number(new Date(a)) - Number(new Date(b)));

    const filterCurrentDate = sortedDate.filter((date) => {
      return this._getDateUTCTimestamp(date) / 1000 > this.initialStartTimestamp();
    });

    const transformDate = filterCurrentDate.map((date) => removeTimeFromIsoDate((date)));

    return [...new Set(transformDate)];
  }

  private _addRoute(route: RideModelRoutesSelectedDate): void {
    this._rideModelRoutesSelectedDate.update((model) => [...model, route]);
  }
}
