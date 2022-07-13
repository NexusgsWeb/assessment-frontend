import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAssessmentAnswersComponent } from './display-assessment-answers.component';

describe('DisplayAssessmentAnswersComponent', () => {
  let component: DisplayAssessmentAnswersComponent;
  let fixture: ComponentFixture<DisplayAssessmentAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAssessmentAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAssessmentAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
