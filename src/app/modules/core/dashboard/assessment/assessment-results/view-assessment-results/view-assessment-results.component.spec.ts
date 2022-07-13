import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentResultsComponent } from './view-assessment-results.component';

describe('ViewAssessmentResultsComponent', () => {
  let component: ViewAssessmentResultsComponent;
  let fixture: ComponentFixture<ViewAssessmentResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssessmentResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssessmentResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
