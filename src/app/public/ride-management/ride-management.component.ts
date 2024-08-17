import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ride-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './ride-management.component.html',
  styleUrl: './ride-management.component.scss',
})
export class RideManagementComponent {}
