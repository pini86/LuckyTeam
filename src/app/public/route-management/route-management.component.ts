import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../../shared/services/route.service';
import { StateService } from '../../shared/services/state.service';
import { ModalAddItemComponent } from './modal-add-item/modal-add-item.component';
import { RouteItemComponent } from './route-item/route-item.component';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [RouteItemComponent, ModalAddItemComponent, MatButton],
  templateUrl: './route-management.component.html',
  styleUrl: './route-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteManagementComponent implements OnInit {
  protected readonly _dialog = inject(MatDialog);
  private readonly _routeService: RouteService = inject(RouteService);
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;

  public ngOnInit(): void {
    this._routeService.getCities();
  }

  public openDialog(): void {
    const dialogRef = this._dialog.open(ModalAddItemComponent, {
      data: { cities: this._cities() },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The modal-add-item was closed', result);
      if (result !== undefined) {
        console.log('[29] 🚀: Confirmation success');
      }
    });
  }
}
