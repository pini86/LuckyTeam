import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CityModel } from '../../types/routes.model';

@Component({
  selector: 'app-connected-stations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatIconModule],
  templateUrl: './connected-stations.component.html',
  styleUrl: './connected-stations.component.scss',
})
export class ConnectedStationsComponent implements OnInit, OnChanges {
  @Input() public stationsList: CityModel[] = []; // Список всех станций с сервера
  @Input() public connectedStations!: FormArray; // Массив для хранения выбранных станций

  constructor(private fb: FormBuilder) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['connectedStations'] && !this.connectedStations) {
      console.error('connectedStations is still not initialized after changes!');
    } else {
      //console.log('connectedStations has been passed to component:', this.connectedStations);
    }
  }

  public ngOnInit(): void {
    // eslint-disable-next-line unicorn/no-negated-condition
    if (!this.connectedStations) {
      console.error('connectedStations is not initialized!');
    } else {
      if (this.connectedStations.length === 0) {
        this.addConnectedStation(); // Добавить первое поле при инициализации
      }
    }
  }

  public addConnectedStation(): void {
    this.connectedStations.push(this.fb.control('', Validators.required));
  }

  public removeConnectedStation(index: number): void {
    this.connectedStations.removeAt(index);
  }

  public trackByIndex(index: number, stationControl: AbstractControl): number {
    return index;
  }

  public trackByStationId(index: number, station: CityModel): number {
    return station.id;
  }

  public asFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  public onStationSelect(stationId: number, index: number): void {
    if (index === this.connectedStations.length - 1) {
      this.addConnectedStation();
    }
  }
}
