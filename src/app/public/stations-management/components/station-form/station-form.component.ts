import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StationValidators } from 'src/app/shared/utils/station-validators';
import { ConnectedStationsComponent } from '../connected-stations/connected-stations.component';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ConnectedStationsComponent,
  ],
})
export class StationFormComponent implements OnInit {
  public stationForm: FormGroup;

  // Доступные станции для выбора в списке подключений
  public availableStations = [
    { id: 1, distance: 50 },
    { id: 2, distance: 100 },
  ];

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.stationForm = this.fb.group({
      city: ['', [Validators.required, StationValidators.cityNameValidator]],
      latitude: ['', [Validators.required, StationValidators.latitudeValidator]],
      longitude: ['', [Validators.required, StationValidators.longitudeValidator]],
      connectedStations: this.fb.array<FormControl>([]), // Массив подключённых станций
    });

    // Слушаем изменения широты и долготы для синхронизации с картой
    this.stationForm.get('latitude')?.valueChanges.subscribe((value) => {
      this.updateMapMarker(value, this.stationForm.get('longitude')?.value);
    });

    this.stationForm.get('longitude')?.valueChanges.subscribe((value) => {
      this.updateMapMarker(this.stationForm.get('latitude')?.value, value);
    });
  }

  public get latitude(): AbstractControl | null {
    return this.stationForm.get('latitude');
  }

  public get longitude(): AbstractControl | null {
    return this.stationForm.get('longitude');
  }

  public get connectedStations(): FormArray<FormControl> {
    return this.stationForm.get('connectedStations') as FormArray<FormControl>;
  }

  public addConnectedStation(): void {
    this.connectedStations.push(this.fb.control('', Validators.required)); // Добавляем валидатор для нового элемента
  }

  public trackByStationId(index: number, control: FormControl): number {
    return control.value;
  }

  public onSubmit(): void {
    if (this.stationForm.valid) {
      // Логика отправки данных формы (например, через сервис)
      console.log(this.stationForm.value);
    }
  }

  public updateMapMarker(latitude: number, longitude: number): void {
    // Вызов функции в StationMapComponent для обновления маркера
    console.log(`Обновить маркер на карте: широта ${latitude}, долгота ${longitude}`);
  }

  public hasError(controlName: string, errorCode: string): boolean {
    const control = this.stationForm.get(controlName);
    return control ? control.hasError(errorCode) : false;
  }
}
