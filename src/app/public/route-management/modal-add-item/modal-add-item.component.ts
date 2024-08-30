import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { TransformRideCityPipe } from '../../../shared/pipes/transform-ride-city.pipe';
import { CitiesItems } from '../../../shared/types/routes.model';
import { DialogAddRouteData } from '../types/dialogs.types';

@Component({
  selector: 'app-modal-add-item-route',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    CdkMonitorFocus,

    MatDialogTitle,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    FormsModule,
    TransformRideCityPipe,
  ],
  templateUrl: './modal-add-item.component.html',
  styleUrl: './modal-add-item.component.scss',
})
export class ModalAddItemComponent implements OnInit {
  protected readonly _form = new FormGroup({
    cities: new FormArray([]),
    carriages: new FormArray([]),
  });
  protected readonly _cities = signal<CitiesItems>(null);
  private readonly _dialogRef = inject(MatDialogRef<ModalAddItemComponent>);
  private readonly _data = inject<DialogAddRouteData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this._cities.set(this._data.cities);
  }

  public onNoClick(): void {
    this._dialogRef.close();
  }

  protected _submit(): void {
    console.log('[74] 🍄:', this._form.value);
  }
}
