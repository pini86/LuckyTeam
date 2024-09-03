import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StationValidators } from 'src/app/shared/utils/station-validators';
import { StationService } from '../../services/station.service';
import { CityModel } from '../../types/routes.model';
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

      const relations = this._getConnectedStations().getRawValue();
      console.log('Relations:', relations);

      const stationData = {
        city: formData.city,
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
        relations: relations,
      };

      this.addStation(stationData);
    }
  }

  private _getConnectedStations(): FormArray {
    return this.stationForm.get('connectedStations') as FormArray;
  }

  public addStation(stationData: { city: string; latitude: number; longitude: number; relations: number[] }): void {
    this.stationService.addStation(stationData).subscribe({
      next: (newStation) => {
        console.log('Новая станция создана:', newStation);
        // Обновляем список станций
        this.stationService.getCities();

        // Очистка формы после успешного создания станции
        this.stationForm.reset();
      },
      error: (error: Error) => console.log('Ошибка при создании станции:', error),
    });
  }

  public hasError(controlName: string, errorCode: string): boolean {
    const control = this.stationForm.get(controlName);
    return control ? control.hasError(errorCode) : false;
  }
}
