import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TripService } from '../../shared/services/trip.service';
import { ActivatedRoute } from '@angular/router';
import { ICarriagesVM, ITrip, ITripVM, IUniqueCarriagesVM } from '../../shared/interfaces/trip.interface';
import { CommonModule, Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RideComponent } from '../ride-management/ride/ride.component';
import { IStations } from '../../shared/interfaces/stations.interface';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin, map } from 'rxjs';
import { CarriageService } from '../../shared/services/carriage.service';


// http://localhost:4200/trip/6?from=145&to=159

@Component({
  selector: 'app-trip-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, MatButton, MatCard, MatTabsModule, RideComponent, CommonModule],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss',
})
export class TripDetailsComponent implements OnInit {
  private _location = inject(Location);
  private _activatedRoute = inject(ActivatedRoute);
  private _tripService = inject(TripService);
  protected _carriageService = inject(CarriageService);

  protected _tripVMSignal = signal<ITripVM>(null);

  public rideId: string | null;
  public fromStationId: string;
  public toStationId: string;

  public ngOnInit(): void {
    this.rideId = this._activatedRoute.snapshot.paramMap.get('rideId');
    this.fromStationId = this._activatedRoute.snapshot.queryParamMap.get('from');
    this.toStationId = this._activatedRoute.snapshot.queryParamMap.get('to');

    if (this.rideId) {
      this.loadTrip(this.rideId);
      this._carriageService.getCarriages()
    }
  }

  public loadTrip(rideId: string): void {
    forkJoin({
      trip: this._tripService.getTrip(rideId),
      stations: this._tripService.getStations(),
    }).pipe(
      map(({ trip, stations }) => this._buildTripVM(trip, stations))
    ).subscribe({
      next: (tripVM) => {
        this._tripVMSignal.set(tripVM);
      },
      error: (error) => console.error('Error loading trip or stations:', error),
    });
  }


  private _buildTripVM(trip: ITrip, stations: IStations[]): ITripVM {
    const firstCityId = trip.path[0];
    const lastCityId = trip.path[trip.path.length - 1];

    const formattedFirstCityName = stations.find(city => city.id === firstCityId)?.city || '';
    const formattedLastCityName = stations.find(city => city.id === lastCityId)?.city || '';

    const capitalize = (cityName: string): string => cityName.charAt(0).toUpperCase() + cityName.slice(1);

    const firstCityName = capitalize(formattedFirstCityName);
    const lastCityName = capitalize(formattedLastCityName);

    const segments = trip.schedule.segments;

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    };

    const formatDateTime = (dateString: string): string => {
      return new Date(dateString)
        .toLocaleString('en-US', options)
        .replace(' at', ',');
    };

    const departureDate = segments.length > 0 && segments[0].time.length > 0
      ? formatDateTime(segments[0].time[0])
      : '';

    const arrivalDate = segments.length > 0 && segments[segments.length - 1].time.length > 1
      ? formatDateTime(segments[segments.length - 1].time[1])
      : '';


    const carriagesVM: ICarriagesVM[] = trip.carriages.map((carriage, index) => {
      const occupiedSeats = segments.reduce((sum, segment) => {
        return sum + segment.occupiedSeats.filter(seat => seat.toString() === carriage).length;
      }, 0);

      const price = segments.reduce((sum, segment) => {
        return sum + (segment.price[carriage] || 0);
      }, 0) / 100;

      const countSeats = this._carriageService.carriagesFromResponseSignal()
        .find((item) => item.code === carriage)?.countSeats || 0;

      return {
        number: index + 1,
        name: `Car ${index + 1}`,
        type: carriage,
        occupiedSeats,
        price,
        countSeats,
      };
    });

    const uniqueCarriagesSet = new Set(trip.carriages);

    const uniqueCarriagesVM: IUniqueCarriagesVM[] = [...uniqueCarriagesSet].map(carriage => {
      const occupiedSeats = segments.reduce((sum, segment) => {
        return sum + segment.occupiedSeats.filter(seat => seat.toString() === carriage).length;
      }, 0);

      const price = segments.reduce((sum, segment) => {
        return sum + (segment.price[carriage] || 0);
      }, 0) / 100;

      const countSeats = trip.carriages
        .filter((item) => item === carriage)
        .reduce((total, item) => {
          const carriageData = this._carriageService.carriagesFromResponseSignal().find(c => c.code === item);
          return total + (carriageData ? carriageData.countSeats : 0);
        }, 0);

      return {
        type: carriage,
        occupiedSeats,
        price,
        countSeats,
      };
    });
    return {
      rideId: trip.rideId,
      firstCityName,
      lastCityName,
      departureDate,
      arrivalDate,
      carriages: carriagesVM,
      uniqueCarriages: uniqueCarriagesVM
    };
  }

  protected _handleBack(): void {
    this._location.back();
  }
}
