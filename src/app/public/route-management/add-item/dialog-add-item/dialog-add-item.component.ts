import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatInput } from '@angular/material/input';
import { DialogData } from '../add-item-route.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

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
    MatGridTile
  ],
  templateUrl: './dialog-add-item.component.html',
  styleUrl: './dialog-add-item.component.scss',
})
export class DialogAddItemComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAddItemComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
