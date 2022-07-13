import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentExamComponent } from './assessment-exam.component';

describe('AssessmentExamComponent', () => {
  let component: AssessmentExamComponent;
  let fixture: ComponentFixture<AssessmentExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
