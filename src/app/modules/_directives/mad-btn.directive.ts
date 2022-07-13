import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[MADBtn]',
})
export class MADBtnDirective {
  @Input() public isWhite = false;

  constructor(public elementRef: ElementRef) {}
  ngOnInit() {
    this.elementRef.nativeElement.classList.add('button');
    this.elementRef.nativeElement.classList.add('is-outlinedis-outlined');
    this.elementRef.nativeElement.classList.add('has-text-weight-semibold');
    if (this.isWhite) {
      this.elementRef.nativeElement.classList.add('is-normal');
      this.elementRef.nativeElement.classList.add('has-background-white');
      this.elementRef.nativeElement.classList.add('has-text-info');
    } else {
      this.elementRef.nativeElement.classList.add('is-normal');
      this.elementRef.nativeElement.classList.add('has-background-info');
      this.elementRef.nativeElement.classList.add('has-text-white');
    }
  }
}

