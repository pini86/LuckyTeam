import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stations-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './stations-management.component.html',
  styleUrl: './stations-management.component.scss',
})
export class StationsManagementComponent {}
