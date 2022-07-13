import { Directive, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core'

@Directive({
  selector: '[appDisableRightClick], [appDisableContextMenu]'
})
export class DisableRightClickDirective {
  constructor(private _elRef: ElementRef) { }

  @HostListener('contextmenu', ['$event']) onContextMenu($event: any) {
    if ((this._elRef.nativeElement.attributes).hasOwnProperty('appDisableRightClick')) {
      console.log('selector: appDisableRightClick');
    } else if ((this._elRef.nativeElement.attributes).hasOwnProperty('appDisableContextMenu')) {
      console.log('selector: appDisableContextMenu');
    }
    $event.preventDefault();
  }

}
