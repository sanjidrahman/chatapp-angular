import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function whiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b$/
      return emailRegexp.test(control.value) ? null : { email: true };
    };
  }
