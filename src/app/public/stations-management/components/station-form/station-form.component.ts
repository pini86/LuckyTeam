import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StationValidators } from 'src/app/shared/utils/station-validators';
import { CityModel } from '../../../../shared/types/routes.model';
import { StationService } from '../../services/station.service';
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
  public stationsList: CityModel[] = []; // Список существующих станций

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
  ) {}

  public ngOnInit(): void {
    this.stationForm = this.fb.group({
      city: ['', [Validators.required, StationValidators.cityNameValidator]],
      latitude: ['', [Validators.required, StationValidators.latitudeValidator]],
      longitude: ['', [Validators.required, StationValidators.longitudeValidator]],
      connectedStations: this.fb.array([]), // Массив подключённых станций
    });

    // Подписка на обновления списка станций
    this.stationService.getCitiesObserver().subscribe((stations) => {
      this.stationsList = stations;
    });

    // Инициируем загрузку списка станций
    this.stationService.getCities();
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

  public trackByStationId(index: number, control: FormControl): number {
    return control.value;
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public onSubmit(): void {
    if (this.stationForm.valid) {
      const formData = this.stationForm.value;
      console.log('Form Data:', formData); // Логируем данные формы

      const relations = this._getConnectedStations().getRawValue();
      console.log('Relations:', relations);

      // Проверяем типы данных
      console.log('Типы данных:', {
        city: typeof formData.city, // Должен быть 'string'
        latitude: typeof formData.latitude, // Должен быть 'number'
        longitude: typeof formData.longitude, // Должен быть 'number'
        relations: relations.map((rel) => typeof rel), // Должен быть ['number', 'number', ...]
      });

      const stationData = {
        city: formData.city,
        latitude: Number.parseFloat(formData.latitude), // Преобразуем в число
        longitude: Number.parseFloat(formData.longitude), // Преобразуем в число
        relations: relations,
      };

      console.log('Данные для отправки:', stationData); // Логируем данные для отправки
      this.addStation(stationData);
    }
  }

  private _getConnectedStations(): FormArray {
    return this.stationForm.get('connectedStations') as FormArray;
  }

  public addStation(stationData: { city: string; latitude: number; longitude: number; relations: number[] }): void {
    this.stationService.addStation(stationData);
  }

  public hasError(controlName: string, errorCode: string): boolean {
    const control = this.stationForm.get(controlName);
    return control ? control.hasError(errorCode) : false;
  }
}
