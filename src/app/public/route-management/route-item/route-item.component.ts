import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { RouteService } from '../../../shared/services/route.service';
import { StateService } from '../../../shared/services/state.service';
import { RoutesModel } from '../../../shared/types/routes.model';
import { ConfirmModalComponent } from '../../ride-management/confirm-modal/confirm-modal.component';
import { ModalItemComponent } from '../modal-item/modal-item.component';

@Component({
  selector: 'app-route-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatIconModule,
    MatFabButton,
    MatRipple,
    MatTabGroup,
    AsyncPipe,
    NgFor,
    TransformRideCityPipe,
  ],
  templateUrl: './route-item.component.html',
  styleUrl: './route-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteItemComponent implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _routes = this._stateService.routes;
  protected readonly _cities = this._stateService.cities;
  protected readonly _carriages = this._stateService.carriages;
  private readonly _router = inject(Router);

  public ngOnInit(): void {
    this._routeService.getRoutes();
  }

  protected _handleUpdate(route: RoutesModel): void {
    const dialogRef = this._dialog.open(ModalItemComponent, {
      data: { route, cities: this._cities(), carriages: this._carriages() },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The modal-item was closed', result);
    });
  }

  protected _handlerClickAssignRoute(id: string): void {
    this._router.navigateByUrl(`admin/routes/${id}`);
  }

  protected _handlerClickDeleteRoute(id: string): void {
    const dialogRef = this._dialog.open(ConfirmModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this._routeService.deleteRoute(id);
      }
    });
  }
}
