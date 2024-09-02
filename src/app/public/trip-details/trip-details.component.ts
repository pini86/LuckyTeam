import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TripService } from '../../shared/services/trip.service';
import { ActivatedRoute } from '@angular/router';
import { ITrip } from '../../shared/interfaces/trip.interface';
import { Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RideComponent } from '../ride-management/ride/ride.component';
import { IStations } from '../../shared/interfaces/stations.interface';
import { MatCard } from '@angular/material/card';


// http://localhost:4200/trip/6?from=145&to=159

@Component({
  selector: 'app-trip-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, MatButton, MatCard, RideComponent],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _tripService = inject(TripService);
  private readonly _location = inject(Location);

  protected _tripSignal = signal<ITrip>(null);
  protected _cityNameSignal = signal<string[]>([]);
  protected _cityNameSignal2 = signal<Record<number, string>[]>([]);

  public rideId: string | null;
  public fromStationId: string;
  public toStationId: string;
  protected _path: number[];
  protected _stations: IStations[];

  public ngOnInit(): void {
    this.rideId = this._activatedRoute.snapshot.paramMap.get('rideId');
    this.fromStationId = this._activatedRoute.snapshot.queryParamMap.get('from');
    this.toStationId = this._activatedRoute.snapshot.queryParamMap.get('to');

    if (this.rideId) {
      this.loadTrip(this.rideId);
    }
  }

  protected _handleBack(): void {
    this._location.back();
  }

  public loadTrip(rideId: string): void {
    this._tripService.getTrip(rideId).subscribe({
      next: (data) => {
        this._tripSignal.set(data);
        this._path = data.path;
        console.log('Trip signal:', rideId, this._tripSignal());
        console.log('Path signal:', rideId, this._path);

        if (this._path && this._path.length > 0) {
          this.loadCityNamesByIds(this._path);
        }
      },
      error: (error) => console.error('Error loading trip:', error),
    });
  }

  public loadCityNamesByIds(ids: number[]): void {
    this._tripService.getStations().subscribe({
      next: (data) => {
        const namesCities = ids.map(id => {
          const matchingCity = data.find(city => city.id === id);
          return matchingCity ? matchingCity.city : '';
        });
        this._cityNameSignal.set(namesCities);
        console.log(this._cityNameSignal());
      },
      error: (error) => console.error('Error loading trip:', error),
    });
  }

  public loadCityNamesByIds2(ids: number[]): void {
    this._tripService.getStations().subscribe({
      next: (data) => {
        const namesCities = ids
          .filter(city => city !== null)
          .map(id => {
            const matchingCity = data.find(city => city.id === id);
            return matchingCity ? { id: matchingCity.id, city: matchingCity.city } : null;
          });
        this._cityNameSignal2.set(namesCities);
        console.log(namesCities);

      },
      error: (error) => console.error('Error loading trip:', error),
    });
  }
}
