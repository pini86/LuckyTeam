import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { RouteService } from '../../../shared/services/route.service';
import { StateService } from '../../../shared/services/state.service';
import { RoutesModel } from '../../../shared/types/routes.model';
import { ModalEditItemComponent } from '../modal-edit-item/modal-edit-item.component';

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
export class RouteItemComponent implements OnInit, OnDestroy {
  protected readonly _routes = signal<RoutesModel[]>([]);
  private readonly _dialog = inject(MatDialog);
  private readonly _routeService: RouteService = inject(RouteService);
  protected readonly _routes$: Observable<RoutesModel[]> = this._routeService.getRoutesObserver();
  private readonly _stateService: StateService = inject(StateService);
  protected readonly _cities = this._stateService.cities;
  private readonly _router = inject(Router);
  private readonly _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this._routeService.getRoutes();

    this._routes$
      .pipe(
        // map(arr => arr.slice((p.currentMainPage - 1) * p.offset, p.offset * p.currentMainPage)),
        map((arr) => arr.slice(0, 10)),
        tap((t) => console.log('[32] 🥕:', t)),
        takeUntil(this._destroy$),
      )
      .subscribe((data) => this._routes.set(data));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected _handleUpdate(route: RoutesModel): void {
    console.log('[67] 🚀:', route);
    const dialogRef = this._dialog.open(ModalEditItemComponent, {
      data: { route, cities: this._cities() },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The modal-add-item was closed', result);
    });
  }

  protected _handlerClickAssignRide(id: string): void {
    this._router.navigateByUrl(`admin/routes/${id}`);
  }
}
