import { Component, inject, model, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { DialogAddItemComponent } from './dialog-add-item/dialog-add-item.component';

@Component({
  selector: 'app-add-item-route',
  standalone: true,
  imports: [MatDialogContent, MatFormField, MatDialogActions, MatButton],
  templateUrl: './add-item-route.component.html',
  styleUrl: './add-item-route.component.scss',
})
export class AddItemRouteComponent {
  protected readonly _animal = signal('');
  protected readonly _name = model('');
  protected readonly _dialog = inject(MatDialog);

  public openDialog(): void {
    const dialogRef = this._dialog.open(DialogAddItemComponent, {
      data: { name: this._name(), animal: this._animal(), select: 'select' },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add-item was closed', result);
      if (result !== undefined) {
        this._animal.set(result);
      }
    });
  }
}
