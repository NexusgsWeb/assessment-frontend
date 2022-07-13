import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentListStudentComponent } from './assessment-list-student.component';

describe('AssessmentListStudentComponent', () => {
  let component: AssessmentListStudentComponent;
  let fixture: ComponentFixture<AssessmentListStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentListStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
