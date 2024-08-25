import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;

  // Доступные станции для выбора в списке подключений
  availableStations = [
    { id: 1, distance: 50 },
    { id: 2, distance: 100 },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.stationForm = this.fb.group({
      city: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
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

  get latitude(): AbstractControl | null {
    return this.stationForm.get('latitude');
  }

  get longitude(): AbstractControl | null {
    return this.stationForm.get('longitude');
  }

  get connectedStations(): FormArray<FormControl> {
    return this.stationForm.get('connectedStations') as FormArray<FormControl>;
  }

  addConnectedStation(): void {
    this.connectedStations.push(this.fb.control(''));
  }

  trackByStationId(index: number, control: FormControl<{ id: number; distance: number }>): number {
    return control.value.id;
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      // Логика отправки данных формы (например, через сервис)
      console.log(this.stationForm.value);
    }
  }

  updateMapMarker(latitude: number, longitude: number): void {
    // Вызов функции в StationMapComponent для обновления маркера
    // Вызывайте событие или функцию для взаимодействия с картой
    console.log(`Обновить маркер на карте: широта ${latitude}, долгота ${longitude}`);
    // Реализация логики взаимодействия с StationMapComponent (например, через EventEmitter или общий сервис)
  }
}
