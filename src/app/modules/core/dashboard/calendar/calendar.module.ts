
// import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';

import { DatepickerInlineCalendarComponent } from './datepicker-inline-calendar/datepicker-inline-calendar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { CalendarComponent } from './calendar.component';


// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
// import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
// import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule } from '@angular/material/dialog';
import { MyModalComponent } from './my-modal/my-modal.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { FullDayCalendarComponent } from './full-day-calendar/full-day-calendar.component';
import { ElementTreeComponent } from './element-tree/element-tree.component';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';
import { AppFullCalenderComponent } from './full-calender/full-calender.component';
// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin,
//   timeGridPlugin
// ]);
@NgModule({
    declarations: [
        CalendarComponent,
        AppFullCalenderComponent,
        DatepickerInlineCalendarComponent,
        MyModalComponent,
        FullDayCalendarComponent,
        ElementTreeComponent,
    ],
    imports: [
        // FullCalendarModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSelectModule,
        NgxMaterialTimepickerModule,
        CdkTreeModule,
        MatTreeModule
    ],
    exports: [],
    providers: [],
    bootstrap: [CalendarComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarModule { }
