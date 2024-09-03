import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { SearchService } from '../../shared/services/search.service';
import { StateService } from '../../shared/services/state.service';
import { CityModel } from '../../shared/types/routes.model';
import { SearchResultComponent } from './search-result/search-result.component';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatSuffix,
    MatDateRangeInput,
    MatButton,
    MatAutocomplete,
    MatOption,
    NgFor,
    AsyncPipe,
    MatAutocompleteTrigger,
    SearchResultComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  protected _form = new FormGroup({
    from: new FormControl<string>(null, [Validators.required]),
    to: new FormControl<string>(null, Validators.required),
    date: new FormControl<string>('', Validators.required),
    time: new FormControl<string>({ value: '', disabled: true }),
  });
  protected readonly _minDate = new Date();
  protected _filteredOptionsFrom: Observable<CityModel[]>;
  protected _filteredOptionsTo: Observable<CityModel[]>;
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _searchService: SearchService = inject(SearchService);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;
  protected readonly _searchRoutes = this._stateService.searchRoutes;

  public ngOnInit(): void {
    this._routeService.getCities();

    this._filteredOptionsFrom = this._form.controls.from.valueChanges.pipe(
      startWith(''),
      map((val) => this._filter(val)),
    );

    this._filteredOptionsTo = this._form.controls.to.valueChanges.pipe(
      startWith(''),
      map((val) => this._filter(val)),
    );
  }

  protected _submit(): void {
    const valueFrom = this._form.controls.from.value;
    const valueTo = this._form.controls.to.value;

    const fromCity = this._cities().find((city) => city.city === valueFrom);
    const toCity = this._cities().find((city) => city.city === valueTo);

    if (!fromCity) {
      this._form.controls.from.setErrors({ error: 'invalid' });
    }

    if (!toCity) {
      this._form.controls.to.setErrors({ error: 'invalid' });
    }

    if (fromCity && toCity) {
      const fromLatitude = fromCity.latitude;
      const fromLongitude = fromCity.longitude;
      const toLatitude = toCity.latitude;
      const toLongitude = toCity.longitude;

      let dateTimestamp: number;

      if (this._form.value.time) {
        const date = new Date(this._form.value.date);
        const time = this._form.value.time.split(':');

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = time[0];
        const minutes = time[1];

        dateTimestamp = new Date(year, month, day, Number(hour), Number(minutes)).getTime() / 1000;
      } else {
        dateTimestamp = new Date(this._form.value.date).getTime() / 1000;
      }

      console.table({
        fromLatitude,
        fromLongitude,
        toLatitude,
        toLongitude,
      });

      this._searchService.getSection({ fromLatitude, fromLongitude, toLongitude, toLatitude, time: dateTimestamp });
    }
  }

  protected _handleChangeDate(): void {
    if (this._form.controls.date.valid) {
      this._form.controls.time.enable();
    } else {
      this._form.controls.time.disable();
    }
  }

  private _filter(val: string): CityModel[] {
    return this._cities().filter((model) => model.city.toLowerCase().startsWith(val.toLowerCase()));
  }
}
