import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentListStudentItemComponent } from './assessment-list-student-item.component';

describe('AssessmentListStudentItemComponent', () => {
  let component: AssessmentListStudentItemComponent;
  let fixture: ComponentFixture<AssessmentListStudentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentListStudentItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListStudentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
