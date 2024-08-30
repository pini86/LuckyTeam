import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ColoredBorderDirective } from '../../../shared/directives/colored-list-ride.directive';
import { RideService } from '../../../shared/services/ride.service';
import { RouteService } from '../../../shared/services/route.service';
import { CitiesItems } from '../../../shared/types/routes.model';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SegmentItemComponent } from '../segment-item/segment-item.component';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [FormsModule, MatCard, MatCardHeader, MatIcon, MatCardContent, MatCardTitle, ColoredBorderDirective, SegmentItemComponent],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideComponent implements OnInit {
  protected readonly _city = signal<CitiesItems>(null);
  protected readonly _dialog = inject(MatDialog);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _rideService: RideService = inject(RideService);
  protected readonly _currentRideId = this._rideService.currentRideId;
  protected readonly _currentRide = this._rideService.currentRide;
  private readonly _cities$ = this._routeService.getCitiesObserver();

  public ngOnInit(): void {
    this._cities$.subscribe((city) => {
      this._city.set(city);
    });
  }

  protected _openConfirmModal(): void {
    const dialogRef = this._dialog.open(ConfirmModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this._rideService.deleteRide();
      }
    });
  }
}
