import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDayCalendarComponent } from './full-day-calendar.component';

describe('FullDayCalendarComponent', () => {
  let component: FullDayCalendarComponent;
  let fixture: ComponentFixture<FullDayCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullDayCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullDayCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
