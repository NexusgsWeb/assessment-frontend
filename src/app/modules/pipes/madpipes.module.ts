import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MADNamePipe } from './madname.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import {FilterLessonPlanPipe} from "./filter-lesson-plan.pipe";

@NgModule({
  declarations: [MADNamePipe, SanitizeHtmlPipe, FilterLessonPlanPipe],
  imports: [CommonModule],
  exports: [MADNamePipe, SanitizeHtmlPipe, FilterLessonPlanPipe],
})
export class MADPipesModule {}
