import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    CdkMonitorFocus,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatDialogClose,
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  private readonly _dialogRef = inject(MatDialogRef<ConfirmModalComponent>);

  protected _onNoClick(): void {
    this._dialogRef.close();
  }
}
