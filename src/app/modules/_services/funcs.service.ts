import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Injectable({
  providedIn: 'root'
})
export class FuncsService {

  constructor() { }

  markFormGroupTouched(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched()
      if (control.controls) this.markFormGroupTouched(control)
    })
  }

  toggleAllSelection(checkBox: any, select: MatSelect | HTMLSelectElement) {
    if (select instanceof HTMLSelectElement) {
      if (checkBox) {
        for (let i = 0; i < select.options.length; i++) {
          select.options[i].selected = true
        }
      }
      else {
        for (let i = 0; i < select.options.length; i++) {
          select.options[i].selected = false
        }
      }
    }
    else {
      if (select instanceof MatSelect) {
        if (checkBox) {
          select.options.forEach((item: MatOption) => item.select())
        }
        else {
          select.options.forEach((item: MatOption) => item.deselect())
        }
      }
    }
  }

  uncheckAllButton(select: MatSelect | HTMLSelectElement): boolean {
    let newStatus = true
    if (select instanceof HTMLSelectElement) {
      for (let i = 0; i < select.options.length; i++) {
        if (!select.options[i].selected) {
          newStatus = false
        }
      }
    } else {
      if (select instanceof MatSelect) {
        select.options.forEach((item: MatOption) => {
          if (!item.selected) {
            newStatus = false
          }
        })
      }
    }
    return newStatus
  }
}


