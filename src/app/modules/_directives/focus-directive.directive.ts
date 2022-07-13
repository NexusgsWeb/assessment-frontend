import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  AfterContentInit,
} from '@angular/core';

@Directive({
  selector: '[appFocus]',
})
export class FocusDirective implements AfterContentInit {
  @Input('appFocus')
  private focused: boolean;

  constructor(public element: ElementRef) {}

  ngAfterContentInit(): void {
    // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    if (this.focused) {
      // this.element.nativeElement.focus();
    }
  }
}
