import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentResultsComponent } from './view-student-results.component';

describe('ViewStudentResultsComponent', () => {
  let component: ViewStudentResultsComponent;
  let fixture: ComponentFixture<ViewStudentResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
