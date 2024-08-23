import { Component, inject, model, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { DialogAddItemComponent } from './dialog-add-item/dialog-add-item.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-add-item-route',
  standalone: true,
  imports: [MatDialogContent, MatFormField, MatDialogActions, MatButton],
  templateUrl: './add-item-route.component.html',
  styleUrl: './add-item-route.component.scss',
})
export class AddItemRouteComponent {
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddItemComponent, {
      data: { name: this.name(), animal: this.animal() },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add-item was closed', result);
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}
