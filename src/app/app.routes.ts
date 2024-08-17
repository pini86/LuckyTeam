import { Routes } from '@angular/router';
import { AdminComponent } from './public/admin/admin.component';
import { CarriagesCarsComponent } from './public/carriages-cars/carriages-cars.component';
import { LoginComponent } from './public/login/login.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { OrderComponent } from './public/order/order.component';
import { RegistrationComponent } from './public/registration/registration.component';
import { RideManagementComponent } from './public/ride-management/ride-management.component';
import { RouteManagementComponent } from './public/route-management/route-management.component';
import { SearchComponent } from './public/search/search.component';
import { StationsManagementComponent } from './public/stations-management/stations-management.component';
import { TripDetailsComponent } from './public/trip-details/trip-details.component';
import { UserProfileComponent } from './public/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'user', component: UserProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'trip', component: TripDetailsComponent },
  { path: 'order', component: OrderComponent },
  { path: 'stations', component: StationsManagementComponent },
  { path: 'carriages', component: CarriagesCarsComponent },
  { path: 'route', component: RouteManagementComponent },
  { path: 'ride', component: RideManagementComponent },
  { path: '**', component: NotFoundComponent },
];
