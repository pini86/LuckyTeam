import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddItemRouteComponent } from './add-item/add-item-route.component';
import { RouteItemComponent } from './route-item/route-item.component';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [RouteItemComponent, AddItemRouteComponent],
  templateUrl: './route-management.component.html',
  styleUrl: './route-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteManagementComponent {}
