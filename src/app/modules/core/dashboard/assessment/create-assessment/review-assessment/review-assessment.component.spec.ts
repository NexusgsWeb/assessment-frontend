import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssessmentComponent } from './review-assessment.component';

describe('ReviewAssessmentComponent', () => {
  let component: ReviewAssessmentComponent;
  let fixture: ComponentFixture<ReviewAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
