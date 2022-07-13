import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MADBtnDirective } from './mad-btn.directive';
import { MADPaginationDirective } from './mad-pagination.directive';
import { AdDirective } from './ad.directive';

@NgModule({
  declarations: [MADBtnDirective, MADPaginationDirective, AdDirective],
  imports: [CommonModule],
  exports: [MADBtnDirective, AdDirective],
})
export class MADDirectivesModule {}
