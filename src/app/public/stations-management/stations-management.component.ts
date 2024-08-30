import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StationFormComponent } from './components/station-form/station-form.component';
import { StationListComponent } from './components/station-list/station-list.component';

@Component({
  selector: 'app-stations-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StationFormComponent, StationListComponent],
  templateUrl: './stations-management.component.html',
  styleUrl: './stations-management.component.scss',
})
export class StationsManagementComponent {}
