import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { NgFor } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { CityModel, ModifyRoutesModel } from '../../../../shared/types/routes.model';
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
  ],
  templateUrl: './dialog-add-item.component.html',
  styleUrl: './dialog-add-item.component.scss',
})
export class DialogAddItemComponent implements OnInit {
  protected readonly _route = signal<ModifyRoutesModel>({
    id: 0,
    path: [],
    carriages: [],
  });

  protected readonly _formCities = new FormArray([]);
  protected readonly _form = new FormGroup({
    cities: this._formCities,
  });
  private readonly _dialogRef = inject(MatDialogRef<DialogAddItemComponent>);
  private readonly _fb = inject(FormBuilder);
  private readonly _data = inject<DialogData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    if (this._data.route) {
      this._route.set(this._data.route);

      this._route().path.forEach((path) => {
        // const newControl = new FormControl(path.city, Validators.required);

        this._formCities.push(this._createCities(path));
      });
    }
  }

  public onNoClick(): void {
    this._dialogRef.close();
  }

  getFormGroup(control: AbstractControl) {
    console.log('[79] 🌻:', control);
    return control as FormControl;
  }

  protected _submit(): void {
    console.log('[74] 🍄:', this._form.value);
  }

  private _createCities(path: CityModel): FormGroup {
    return this._fb.group({
      [path.city]: ['', Validators.required],
    });
  }
}
