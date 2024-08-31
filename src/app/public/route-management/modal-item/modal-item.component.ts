import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { RouteService } from '../../../shared/services/route.service';
import { ICarriage } from '../../../shared/types/ride.model';
import { CitiesItems, CityModel, RoutesModel } from '../../../shared/types/routes.model';
import { DialogAddRouteData, FormGroupAddItem } from '../types/dialogs.types';

@Component({
  selector: 'app-modal-item-route',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    CdkMonitorFocus,

    MatDialogTitle,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    FormsModule,
    TransformRideCityPipe,
  ],
  templateUrl: './modal-item.component.html',
  styleUrl: './modal-item.component.scss',
})
export class ModalItemComponent implements OnInit {
  protected readonly _form: FormGroupAddItem = new FormGroup(
    {
      cities: new FormArray<FormControl<CityModel | 0>>([]),
      carriages: new FormArray<FormControl<ICarriage | 0>>([]),
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    [this._onValueChanged],
  );
  protected readonly _cities = signal<CitiesItems>(null);
  protected readonly _carriages = signal<ICarriage[]>(null);
  protected readonly _route = signal<RoutesModel>(null);

  private readonly _dialogRef = inject(MatDialogRef<ModalItemComponent>);
  private readonly _data = inject<DialogAddRouteData>(MAT_DIALOG_DATA);
  private readonly _routeService: RouteService = inject(RouteService);

  public ngOnInit(): void {
    this._cities.set(this._data.cities);
    this._carriages.set(this._data.carriages);

    if (this._data.route) {
      this._route.set(this._data.route);

      this._route().path.forEach((path) => {
        const cityModel = this._cities().find((city) => city.id === path);
        this._form.controls.cities.push(new FormControl(cityModel, [Validators.required]));
      });

      this._route().carriages.forEach((carriageCode) => {
        const carriageModel = this._carriages().find((carriage) => carriage.code === carriageCode);
        this._form.controls.carriages.push(new FormControl(carriageModel));
      });
    }

    this._form.controls.cities.push(new FormControl(0, [Validators.required]));
    this._form.controls.carriages.push(new FormControl(0, [Validators.required]));
  }

  public onNoClick(): void {
    this._dialogRef.close();
  }

  protected _handleSelectedCity(index: number): void {
    const lengthArrNullValueCities = this._form.value.cities.filter((cities) => !!cities).length;

    if (index < lengthArrNullValueCities - 1) {
      const { connectedTo } = this._form.value.cities[index + 1] as CityModel;
      const { id } = this._form.value.cities[index] as CityModel;
      const checkToConnectedTo = connectedTo.find((connect) => connect.id === id);
      if (!checkToConnectedTo) {
        this._form.controls.cities.controls[index + 1].setValue(0);
      }
    }

    if (lengthArrNullValueCities >= this._form.value.cities.length) {
      this._form.controls.cities.push(new FormControl(0, [Validators.required]));
    }
  }

  protected _handleSelectedCarriage(): void {
    const lengthArrEmptyValueCarriages = this._form.value.carriages.filter((carriages) => !!carriages).length;
    if (lengthArrEmptyValueCarriages >= this._form.value.carriages.length) {
      this._form.controls.carriages.push(new FormControl(0, [Validators.required]));
    }
  }

  protected _getCity(id: number): CityModel {
    return this._cities().find((c) => c.id === id);
  }

  protected _submit(): void {
    const arrValueIdCities = this._form.value.cities
      .filter((cities) => cities !== 0)
      .map((cityModel) => {
        if (cityModel instanceof CityModel) {
          return cityModel.id;
        }
        return 0;
      });

    const arrValueCodeCarriages = this._form.value.carriages
      .filter((carriage) => carriage !== 0)
      .map((carriage) => {
        const carr = carriage as ICarriage;
        return carr.code;
      });

    if (this._data.route) {
      this._routeService.updateRoute(arrValueIdCities, arrValueCodeCarriages, this._route().id);
    } else {
      this._routeService.createRoute(arrValueIdCities, arrValueCodeCarriages);
    }

    this._dialogRef.close();
  }

  private _onValueChanged(data: AbstractControl): ValidationErrors {
    const control = data as FormGroupAddItem;
    const citiesValues = control.controls.cities.value;
    const carriagesValues = control.controls.carriages.value;

    const resultValidation = citiesValues.find((value, index) => {
      return value === 0 && index < citiesValues.length - 1;
    });

    console.log('🍁:', carriagesValues);

    const isFilledCitiesValue = citiesValues.filter((value) => value !== 0).length > 1;
    const isFilledCarriagesValue = carriagesValues.some((value) => value !== 0);

    return resultValidation === 0 || !isFilledCitiesValue || !isFilledCarriagesValue ? { error: 'invalid' } : null;
  }
}
