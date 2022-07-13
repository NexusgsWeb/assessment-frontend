import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetAssessmentComponent } from './reset-assessment.component';

describe('ResetAssessmentComponent', () => {
  let component: ResetAssessmentComponent;
  let fixture: ComponentFixture<ResetAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
