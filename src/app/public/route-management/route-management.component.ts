import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../../shared/services/route.service';
import { StateService } from '../../shared/services/state.service';
import { ModalItemComponent } from './modal-item/modal-item.component';
import { RouteItemComponent } from './route-item/route-item.component';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [MatButton, RouteItemComponent],
  templateUrl: './route-management.component.html',
  styleUrl: './route-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteManagementComponent implements OnInit {
  protected readonly _dialog = inject(MatDialog);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;
  protected readonly _carriages = this._stateService.carriages;

  public ngOnInit(): void {
    this._routeService.getCities();
    this._routeService.getCarriages();
  }

  public openDialog(): void {
    this._dialog.open(ModalItemComponent, {
      data: { cities: this._cities(), carriages: this._carriages() },
      width: '80%',
    });
  }
}
