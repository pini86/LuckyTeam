import { CitiesItems, RoutesModel } from '../../../shared/types/routes.model';

export interface DialogData {
  route: RoutesModel;
  cities: CitiesItems;
}

export interface DialogAddRouteData {
  cities: CitiesItems;
}
