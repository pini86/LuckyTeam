import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICarriageVM, ICarriage } from '../../shared/interfaces/carriages.interface';
import { map } from 'rxjs';

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
  public carriagesFromResponseSignal = signal<ICarriageVM[]>([]);
  public carriageVM = signal<ICarriageVM | null>(null);
  public isUpdating = false;

  constructor(private fb: FormBuilder, private readonly http: HttpClient, private snackBar: MatSnackBar) { }

  @ViewChild('formContainer') public formContainer: ElementRef;

  public ngOnInit(): void {
    this.savedToken = localStorage.getItem('token');
    this.getCarriages();

    this.form = this.fb.group({
      name: ['', Validators.required],
      rows: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      leftSeats: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      rightSeats: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });

    this.form.valueChanges.subscribe((value) => {
      if (this.form.value.rows <= 20 && this.form.value.leftSeats <= 5 && this.form.value.rightSeats <= 5) {
      this.carriageVM.set(this.buildCarriageToVM(value));
      } else {
        this.carriageVM.set(null);
      }
    })
  }

  public onShowForm(): void {
    this.showForm = !this.showForm;
    this.form.reset();
    this.carriageVM.set(null);
    this.isUpdating = false;
  }

  public getCarriages(): void {
    this.http
      .get<ICarriage[]>('/api/carriage', {
        headers: {
          Authorization: `Bearer ${this.savedToken}`,
        },
      })
      .pipe(
        map((data) => data.map((item) =>
          this.buildCarriageToVM(item))
        )
      )
      .subscribe({
        next: (data) => {
          this.carriagesFromResponseSignal.set(data);
        },
        error: (error) => console.error(error),
      });
  }

  public buildCarriageToVM = (carriage: ICarriage): ICarriageVM => {
    const { code, name, rows, leftSeats, rightSeats } = carriage;
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
      code,
      name,
      columnsCount,
      leftSeats,
      rightSeats
    }
  }

  public onSave(): void {
    if (this.form.valid) {
      const dataFromForm: ICarriage = this.form.value;
      const existingCarriage = this.carriagesFromResponseSignal().find(carriage =>
        carriage.name.trim().toLowerCase() === dataFromForm.name.trim().toLowerCase()
      );

      if (existingCarriage && !this.isUpdating) {
        this.snackBar.open(`A carriage with this name ${this.form.value.name} already exists!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }

      if (this.isUpdating) {
        console.log('existingCarriage.code', this.carriagesFromResponseSignal());
        this.http.put(`/api/carriage/${existingCarriage.code}`, dataFromForm, {
          headers: {
            Authorization: `Bearer ${this.savedToken}`,
          }
        }).subscribe({
          next: () => {
            const updatedCarriages = this.carriagesFromResponseSignal().map(carriage =>
              carriage.name === existingCarriage.name ? this.buildCarriageToVM({ ...carriage, ...dataFromForm }) : carriage
            );
            this.carriagesFromResponseSignal.set(updatedCarriages);
            this.onShowForm();
          },
          error: (error) => console.error(error),
        });
      } else {


        this.http
          .post<{ code: string }>('/api/carriage', dataFromForm, {
            headers: {
              Authorization: `Bearer ${this.savedToken}`,
            },
          })
          .subscribe({
            next: (response) => {
              const carriageWithCode = { ...dataFromForm, code: response.code };
              const carriageWithVM = this.buildCarriageToVM(carriageWithCode);
              const updatedCarriages = [{ ...carriageWithVM }, ...this.carriagesFromResponseSignal()];

              this.carriagesFromResponseSignal.set(updatedCarriages);
              this.onShowForm();
            },
            error: (error) => console.error(error),
          });
      }
    }
  }

  public onUpdate(carriage: ICarriageVM): void {
    this.isUpdating = true;
    this.showForm = true;
    this.form.setValue({
      name: carriage.name,
      rows: carriage.columnsCount,
      leftSeats: carriage.leftSeats,
      rightSeats: carriage.rightSeats
    });
    this.formContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
