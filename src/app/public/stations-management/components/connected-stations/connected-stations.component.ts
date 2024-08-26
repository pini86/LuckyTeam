import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-connected-stations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './connected-stations.component.html',
  styleUrl: './connected-stations.component.scss',
})
export class ConnectedStationsComponent {
  @Input() public connectedStations!: FormArray<FormControl>;
  @Input() public availableStations!: { id: number; distance: number }[];

  public trackByStationId(index: number, control: FormControl): number {
    return control.value;
  }

  // Новая функция trackBy для списка опций
  public trackByOptionId(index: number, option: { id: number; distance: number }): number {
    return option.id;
  }
}
