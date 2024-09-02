/* eslint-disable unicorn/better-regex */
/* eslint-disable no-useless-escape */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailCustomValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value } = control;

    if (!value) {
      return null;
    }

    const emailValid = /[\w\d_]+@[\w\d_]+.\w{2,7}$/.test(value);

    return emailValid ? null : { emailValid: true };
  };
}
