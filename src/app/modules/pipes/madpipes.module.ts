import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MADNamePipe } from './madname.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

@NgModule({
  declarations: [MADNamePipe, SanitizeHtmlPipe],
  imports: [CommonModule],
  exports: [MADNamePipe, SanitizeHtmlPipe],
})
export class MADPipesModule {}
