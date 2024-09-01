import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatSuffix,
    MatDateRangeInput,
    MatButton,
    FormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  protected _form = new FormGroup({
    from: new FormControl<string>('', [Validators.required]),
    to: new FormControl<string>('', Validators.required),
    date: new FormControl<string>('', Validators.required),
  });
  protected readonly _minDate = new Date();

  public ngOnInit(): void {
    console.log('[33] 🎯: ');
  }

  protected _submit(): void {
    console.log('[42] 🚧:', this._form.value);
  }
}
