import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { RideService } from '../../shared/services/ride.service';
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
  protected readonly _currentItemRide = signal<number>(0);
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _rideService: RideService = inject(RideService);
  protected readonly _rides$ = this._rideService.getRideObserver();
  private readonly _location = inject(Location);

  public ngOnInit(): void {
    const id: string | null = this._activateRoute.snapshot.paramMap.get('id');

    if (id) {
      this._rideService.getRite(id);
      this._routeService.getCities();
    }

    this._rides$.pipe(tap((t) => console.log('🆘:', t))).subscribe();
  }

  protected _handleBack(): void {
    this._location.back();
  }

  protected _handleChangeRide(index: number): void {
    this._currentItemRide.set(index);
  }
}
