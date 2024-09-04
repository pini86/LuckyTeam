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
import { adminAccessGuard } from './shared/guards/admin-access.guard';
import { guestAccessGuard } from './shared/guards/guest-access.guard';
import { userAccessGuard } from './shared/guards/user-access.guard';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'signin', component: LoginComponent, canActivate: [guestAccessGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminAccessGuard] },
  { path: 'signup', component: RegistrationComponent, canActivate: [guestAccessGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [userAccessGuard] },
  { path: 'trip/:rideId', component: TripDetailsComponent },
  { path: 'orders', component: OrderComponent, canActivate: [userAccessGuard] },
  { path: 'admin/stations', component: StationsManagementComponent, canActivate: [adminAccessGuard] },
  { path: 'admin/carriages', component: CarriagesCarsComponent, canActivate: [adminAccessGuard] },
  { path: 'admin/routes', component: RouteManagementComponent, canActivate: [adminAccessGuard] },
  { path: 'admin/routes/:id', component: RideManagementComponent, canActivate: [adminAccessGuard] },
  { path: '**', component: NotFoundComponent },
];
