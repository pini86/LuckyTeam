import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ICarriage } from '../../../shared/types/ride.model';
import { CitiesItems, CityModel, RoutesModel } from '../../../shared/types/routes.model';

export interface DialogData {
  route: RoutesModel;
  cities: CitiesItems;
}

export interface DialogAddRouteData {
  cities: CitiesItems;
  carriages: ICarriage[];
  route?: RoutesModel;
}

export type FormGroupAddItem = FormGroup<{
  cities: FormArray<FormControl<0 | CityModel>>;
  carriages: FormArray<FormControl<0 | ICarriage>>;
}>;
