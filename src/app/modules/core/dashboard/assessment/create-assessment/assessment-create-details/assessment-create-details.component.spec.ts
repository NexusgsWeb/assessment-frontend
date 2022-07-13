import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentCreateDetailsComponent } from './assessment-create-details.component';

describe('AssessmentCreateDetailsComponent', () => {
  let component: AssessmentCreateDetailsComponent;
  let fixture: ComponentFixture<AssessmentCreateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentCreateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentCreateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
