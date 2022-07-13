import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentAnswersComponent } from './view-student-answers.component';

describe('ViewStudentAnswersComponent', () => {
  let component: ViewStudentAnswersComponent;
  let fixture: ComponentFixture<ViewStudentAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStudentAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
