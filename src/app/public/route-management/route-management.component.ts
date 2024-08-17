import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './route-management.component.html',
  styleUrl: './route-management.component.scss',
})
export class RouteManagementComponent {}
