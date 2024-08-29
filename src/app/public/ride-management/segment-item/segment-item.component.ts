import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { RideService } from '../../../shared/services/ride.service';
import { RideModel, Segments } from '../../../shared/types/ride.model';
import { CitiesItems } from '../../../shared/types/routes.model';
import { PriceForm } from './form.type';

@Component({
  selector: 'app-segment-item',
  standalone: true,
  imports: [MatMiniFabButton, KeyValuePipe, MatIcon, ReactiveFormsModule, TransformRideCityPipe],
  templateUrl: './segment-item.component.html',
  styleUrl: './segment-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentItemComponent implements OnInit {
  public readonly index = input.required<number>();
  public readonly cities = input.required<CitiesItems>();
  public readonly isEditableDateField = signal<boolean>(false);
  public readonly isEditablePriceField = signal<boolean>(false);
  protected readonly _form = new FormGroup({
    date: new FormGroup({
      departureDate: new FormControl({ value: '', disabled: true }),
      departureTime: new FormControl({ value: '', disabled: true }),
      arrivalDate: new FormControl({ value: '', disabled: true }),
      arrivalTime: new FormControl({ value: '', disabled: true }),
    }),
    price: new FormGroup<PriceForm>({}),
  });
  protected readonly _segments = computed<Segments[]>(() => {
    return this._currentRide().schedule.find((schedule) => schedule.rideId === this._currentRideId()).segments;
  });
  private readonly _rideService = inject(RideService);
  protected readonly _currentRide = this._rideService.currentRide;
  protected readonly _currentRideId = this._rideService.currentRideId;
  private readonly _injector = inject(Injector);

  public ngOnInit(): void {
    effect(
      () => {
        const dateFormGroup = this._form.controls.date.controls;

        // console.log('[48] 🚀:', this._segments());
        if (this.index() === 0) {
          dateFormGroup.departureDate.setValue(this._transformDate(this.index(), 0).date);
          dateFormGroup.departureTime.setValue(this._transformDate(this.index(), 0).time);
        } else if (this.index() === this._segments().length) {
          dateFormGroup.arrivalDate.setValue(this._transformDate(this.index() - 1, 1).date);
          dateFormGroup.arrivalTime.setValue(this._transformDate(this.index() - 1, 1).time);
        } else {
          dateFormGroup.departureDate.setValue(this._transformDate(this.index(), 0).date);
          dateFormGroup.departureTime.setValue(this._transformDate(this.index(), 0).time);
          dateFormGroup.arrivalDate.setValue(this._transformDate(this.index() - 1, 1).date);
          dateFormGroup.arrivalTime.setValue(this._transformDate(this.index() - 1, 1).time);
        }

        if (this.index() < this._segments().length) {
          const prices = this._segments()[this.index()].price;
          for (const price in prices) {
            if (Object.hasOwn(prices, price)) {
              this._form.controls.price.removeControl(price);
              const control = new FormControl<number>({ value: prices[price], disabled: true }, Validators.required);
              this._form.controls.price.addControl(price, control);
            }
          }
        }
      },
      { injector: this._injector },
    );
  }

  protected _handleChangeDate(): void {
    Object.keys(this._form.controls.date.controls).forEach((key) => {
      if (this.isEditableDateField()) {
        this._form.controls.date.get(key).disable();
      } else {
        this._form.controls.date.get(key).enable();
      }
    });

    if (this.isEditableDateField()) {
      this._submit();
    }
    this.isEditableDateField.update((value) => !value);
  }

  protected _handleChangePrice(): void {
    Object.keys(this._form.controls.price.controls).forEach((key) => {
      if (this.isEditablePriceField()) {
        this._form.controls.price.get(key).disable();
      } else {
        this._form.controls.price.get(key).enable();
      }
    });

    if (this.isEditablePriceField()) {
      this._submit();
    }
    this.isEditablePriceField.update((value) => !value);
  }

  protected _submit(): void {
    const dateFormGroup = this._form.controls.date.controls;
    const modifySegment = this._segments().map((segment, index) => {
      if (index === this.index()) {
        const departureDate = this._transformDateToIso(dateFormGroup.departureDate.value, dateFormGroup.departureTime.value);
        return { time: [departureDate, segment.time[1]], price: this._form.controls.price.value };
      }

      if (index + 1 === this.index()) {
        const arrivalDate = this._transformDateToIso(dateFormGroup.arrivalDate.value, dateFormGroup.arrivalTime.value);
        return { time: [segment.time[0], arrivalDate], price: segment.price };
      }
      return segment;
    });

    const newRide: RideModel = {
      id: this._currentRide().id,
      path: this._currentRide().path,
      carriages: this._currentRide().carriages,
      schedule: this._currentRide().schedule.map((schedule) => {
        if (schedule.rideId === this._currentRideId()) {
          return {
            rideId: schedule.rideId,
            segments: modifySegment,
          };
        }
        return schedule;
      }),
    };

    this._rideService.setCurrentRide(newRide);

    this._rideService.updateRide(this._segments());
  }

  private _transformDate(indexSegment: number, indexTime: 0 | 1): { date: string; time: string } {
    const date = new Date(this._segments()[indexSegment].time[indexTime]);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return { date: `${year}-${month}-${day}`, time: `${hour}:${minutes}` };
  }

  private _transformDateToIso(dateValueControls: string, timeValueControls: string): string {
    const depDate = dateValueControls.split('-');
    const depTime = timeValueControls.split(':');

    const year = Number(depDate[0]);
    const month = Number(depDate[1]) - 1;
    const day = Number(depDate[2]);
    const hours = Number(depTime[0]);
    const minutes = Number(depTime[1]);

    const date = new Date(Date.UTC(year, month, day, hours, minutes));
    return date.toISOString();
  }
}
