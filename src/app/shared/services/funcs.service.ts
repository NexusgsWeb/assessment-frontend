import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

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

  toggleAllSelection(viewChild: any, control: AbstractControl, data: any) {
    if(viewChild.selected || viewChild.checked){
      control.patchValue([...data.map((elem: any)=>elem), 0])
    }else{
      control.patchValue([])
    }
  }
}
