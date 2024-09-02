import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouteService } from '../../shared/services/route.service';
import { StateService } from '../../shared/services/state.service';
import { CityModel } from '../../shared/types/routes.model';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe, NgFor } from '@angular/common';
import { SearchService } from '../../shared/services/search.service';

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
    MatAutocompleteTrigger
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  protected _form = new FormGroup({
    from: new FormControl<string>(null, [Validators.required]),
    to: new FormControl<string>(null, Validators.required),
    date: new FormControl<string>('', Validators.required)
  });
  protected readonly _minDate = new Date();
  protected _filteredOptionsFrom: Observable<CityModel[]>;
  protected _filteredOptionsTo: Observable<CityModel[]>;
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _searchService: SearchService = inject(SearchService);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;

  public ngOnInit(): void {
    this._routeService.getCities();

    this._filteredOptionsFrom = this._form.controls.from.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val))
    );

    this._filteredOptionsTo = this._form.controls.to.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val))
    );
  }

  protected _submit(): void {
    const valueFrom = this._form.controls.from.value;
    const valueTo = this._form.controls.to.value;

    const fromCity = this._cities().find(city => city.city === valueFrom);
    const toCity = this._cities().find(city => city.city === valueTo);

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
      const time = new Date(this._form.value.date).getTime();

      console.log('🍁:', fromLatitude, fromLongitude, toLatitude, toLongitude);


      this._searchService.getSection({ fromLatitude, fromLongitude, toLongitude, toLatitude, time });
    }
  }

  private _filter(val: string): CityModel[] {
    return this._cities().filter(model => model.city.toLowerCase().startsWith(val.toLowerCase()));
  }
}
