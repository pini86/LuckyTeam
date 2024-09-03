import { AbstractControl, ValidationErrors } from '@angular/forms';

export class StationValidators {
  public static cityNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const valid = /^[\sA-Za-z]+$/.test(value);

    return valid ? null : { invalidCityName: 'City name can only contain letters and spaces' };
  }

  public static latitudeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const valid = value >= -90 && value <= 90;
    return valid ? null : { invalidLatitude: 'Latitude must be between -90 and 90' };
  }

  public static longitudeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const valid = value >= -180 && value <= 180;
    return valid ? null : { invalidLongitude: 'Longitude must be between -180 and 180' };
  }
}
