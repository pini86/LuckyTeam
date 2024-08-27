import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarriageVM, ICarriage } from '../../shared/interfaces/carriages.interface';

@Component({
  selector: 'app-carriages-cars',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatListModule, CommonModule, ReactiveFormsModule],
  templateUrl: './carriages-cars.component.html',
  styleUrl: './carriages-cars.component.scss',
})
export class CarriagesCarsComponent implements OnInit {
  public form: FormGroup;
  public savedToken: string;
  public showForm = false;
  public carriagesFromResponseSignal = signal<ICarriage[]>([]);
  public carriageVM = signal<CarriageVM | null>(null);

  constructor(private fb: FormBuilder, private readonly http: HttpClient, private snackBar: MatSnackBar) { }

  public ngOnInit(): void {
    this.savedToken = localStorage.getItem('token');
    this.getCarriages();

    this.form = this.fb.group({
      name: ['', Validators.required],
      rows: ['', [Validators.required, Validators.min(1)]],
      leftSeats: ['', [Validators.required, Validators.min(1)]],
      rightSeats: ['', [Validators.required, Validators.min(1)]],
    });

    this.form.valueChanges.subscribe((value) => {
      this.carriageVM.set(this.buildCarriageToVM(value))
    })
  }

  public onShowForm(): void {
    this.showForm = !this.showForm;
    this.form.reset();
    this.carriageVM.set(null);
    console.log('this.carriageVM', this.carriageVM());
  }

  public getCarriages(): void {
    this.http
      .get<ICarriage[]>('/api/carriage', {
        headers: {
          Authorization: `Bearer ${this.savedToken}`,
        },
      })
      .subscribe({
        next: (data) => {
          this.carriagesFromResponseSignal.set(data);
          console.log('getCarriages()', this.carriagesFromResponseSignal());
          console.log('this.carriagesFromResponseSignal', this.carriagesFromResponseSignal());
        },
        error: (error) => console.error(error),
      });
  }

  public buildCarriageToVM = (carriage: ICarriage): CarriageVM => {
    const {name, rows, leftSeats, rightSeats} = carriage;
    const rowsCount = leftSeats + rightSeats;
    const columnsCount = rows;
    const dividerIndex = rightSeats - 1;

    return {
      rows: Array.from({ length: rowsCount }).map((row, rowIndex) => {
        return Array.from({ length: columnsCount }).map((item, columnIndex) => {
          return {
            index: (rowsCount - rowIndex) + rowsCount * columnIndex,
          }
        })
      }),
      dividerIndex,
      name,
      columnsCount
    }
  }

  public onSave(): void {
    if (this.form.valid) {
      const dataFromForm: ICarriage = this.form.value;
      console.log('dataFromForm', dataFromForm);
      const existingCarriage = this.carriagesFromResponseSignal().find(carriage =>
        carriage.name.trim().toLowerCase() === dataFromForm.name.trim().toLowerCase()
      );

      if (existingCarriage) {
        this.snackBar.open(`A carriage with this name ${this.form.value.name} already exists!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }

      this.http
        .post<{ code: string }>('/api/carriage', dataFromForm, {
          headers: {
            Authorization: `Bearer ${this.savedToken}`,
          },
        })
        .subscribe({
          next: (response) => {
            const updatedCarriages = [{ ...dataFromForm, code: response.code }, ...this.carriagesFromResponseSignal()];
            this.carriagesFromResponseSignal.set(updatedCarriages);
            this.onShowForm();
            // this.carriageVM.set(null);
          },
          error: (error) => console.error(error),
        });
    }
  }

  public onUpdate(carriage: ICarriage): void {
    this.showForm = true;
    this.form.setValue({
      code: carriage.code,
      name: carriage.name,
      rows: carriage.rows,
      leftSeats: carriage.leftSeats,
      rightSeats: carriage.rightSeats,
    });
  }
}
