import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../shared/services/route.service';
import { RideComponent } from './ride/ride.component';

@Component({
  selector: 'app-ride-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MatIcon, MatIconButton, MatButton, RideComponent],
  templateUrl: './ride-management.component.html',
  styleUrl: './ride-management.component.scss',
})
export class RideManagementComponent implements OnInit {
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _routeService: RouteService = inject(RouteService);
  protected readonly _route = this._routeService.getRouteObserver();
  private readonly _location = inject(Location);

  public ngOnInit(): void {
    const id: string | null = this._activateRoute.snapshot.paramMap.get('id');

    if (id) {
      this._routeService.getRoute(id);
    }
  }

  protected _handleBack(): void {
    this._location.back();
  }
}
