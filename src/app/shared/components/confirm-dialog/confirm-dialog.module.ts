import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ConfirmDialogComponent
    ],
    exports: [ConfirmDialogComponent],
    entryComponents: [ConfirmDialogComponent],
    providers: [ConfirmDialogService]
  })
  export class ConfirmDialogModule {
  }
