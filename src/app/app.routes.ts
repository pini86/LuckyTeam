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
  { path: '', component: SearchComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'trip', component: TripDetailsComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'admin/stations', component: StationsManagementComponent },
  { path: 'admin/carriagess', component: CarriagesCarsComponent },
  { path: 'admin/routes', component: RouteManagementComponent },
  { path: 'admin/routes/{id}', component: RideManagementComponent },
  { path: '**', component: NotFoundComponent },
];
