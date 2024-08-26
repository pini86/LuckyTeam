import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { KeyValuePipe, NgFor } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { TransformRideCityPipe } from '../../../../shared/pipes/transform-ride-city.pipe';
import { CitiesItems, RoutesModel } from '../../../../shared/types/routes.model';
import { DialogData } from '../../types/dialogs.types';

@Component({
  selector: 'app-dialog-add-item',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatDialogClose,
    MatFormFieldModule,
    MatDialogTitle,
    MatInput,
    CdkMonitorFocus,
    FormsModule,
    MatGridList,
    MatGridTile,
    MatSelect,
    MatOption,
    MatIcon,
    NgFor,
    ReactiveFormsModule,
    KeyValuePipe,
    TransformRideCityPipe,
  ],
  templateUrl: './dialog-add-item.component.html',
  styleUrl: './dialog-add-item.component.scss',
})
export class DialogAddItemComponent implements OnInit {
  protected readonly _route = signal<RoutesModel>(null);
  protected readonly _cities = signal<CitiesItems>(null);

  protected readonly _form = new FormGroup({
    cities: new FormArray([]),
    carriages: new FormArray([]),
  });
  private readonly _dialogRef = inject(MatDialogRef<DialogAddItemComponent>);
  private readonly _data = inject<DialogData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this._data.route) {
      this._route.set(this._data.route);
      this._cities.set(this._data.cities);

      this._route().path.forEach((path) => {
        this._form.controls.cities.push(new FormControl(path));
      });

      this._route().carriages.forEach((path) => {
        this._form.controls.carriages.push(new FormControl(path));
      });

      console.log('[74] 🍄:', this._route().carriages);
    }
  }

  public onNoClick(): void {
    this._dialogRef.close();
  }

  public asFormControl(formControl: AbstractControl): FormControl {
    return formControl as FormControl;
  }

  protected _submit(): void {
    console.log('[74] 🍄:', this._form.value);
  }
}
