import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionEditMCQOptionComponent } from './madquestion-edit-mcqoption.component';

describe('MADQuestionEditMCQOptionComponent', () => {
  let component: MADQuestionEditMCQOptionComponent;
  let fixture: ComponentFixture<MADQuestionEditMCQOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionEditMCQOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionEditMCQOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
