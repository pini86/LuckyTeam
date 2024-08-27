import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { DialogUpdateTimeData } from '../types';

@Component({
  selector: 'app-dialog-update-time',
  standalone: true,
  imports: [
    CdkMonitorFocus,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    TransformRideCityPipe,
    MatInput,
  ],
  templateUrl: './dialog-update-time.component.html',
  styleUrl: './dialog-update-time.component.scss',
})
export class DialogUpdateTimeComponent implements OnInit {
  protected readonly _form = new FormGroup({
    departureDate: new FormControl('2013-01-08'),
    departureTime: new FormControl('12:23'),
    arrivalDate: new FormControl('2013-01-08'),
    arrivalTime: new FormControl('12:23'),
  });
  protected readonly _departure = signal<number>(0);
  protected readonly _arrival = signal<string>('');
  protected readonly _data = inject<DialogUpdateTimeData>(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(MatDialogRef<DialogUpdateTimeComponent>);

  public onNoClick(): void {
    this._dialogRef.close();
  }

  public ngOnInit(): void {
    const segmentsLength = this._data.ride.schedule[this._data.scheduleRideId].segments.length;
    const firstSegment = 0;

    if (this._data.id === firstSegment) {
      console.log(
        '🌻: Departure',
        new Date(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id].time[0]).toLocaleDateString(),
      );
      this._departure.set(Date.parse(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id].time[0]));

      const date = new Date(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id].time[0]);

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
      const day = String(date.getUTCDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      this._form.controls.departureDate.setValue(formattedDate);
    } else if (this._data.id === segmentsLength) {
      console.log(
        '🌻: Arrival',
        new Date(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id - 1].time[1]).toLocaleString(),
      );
    } else {
      console.log(
        '🌻: Arrival',
        new Date(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id - 1].time[1]).toLocaleString(),
      );
      console.log(
        '🌻: Departure',
        new Date(this._data.ride.schedule[this._data.scheduleRideId - 1].segments[this._data.id].time[0]).toLocaleString(),
      );
    }
  }

  protected _submit(): void {
    console.log('[74] 🍄:', this._form.value.departureDate.split('-')[0]);
    const depDate = this._form.value.departureDate.split('-');
    const depTime = this._form.value.departureTime.split(':');

    const year = Number(depDate[0]);
    const month = Number(depDate[1]);
    const day = Number(depDate[2]);
    const hours = Number(depTime[0]);
    const minutes = Number(depTime[1]);

    console.log('[85] 🐬:', new Date('2024-09-06T20:27:00.000Z'));

    const date = new Date(Date.UTC(year, month, day, hours, minutes));
    const isoString = date.toISOString();

    console.log(isoString);
  }
}
