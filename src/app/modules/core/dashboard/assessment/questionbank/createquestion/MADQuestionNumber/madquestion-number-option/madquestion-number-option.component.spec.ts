import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionNumberOptionComponent } from './madquestion-number-option.component';

describe('MADQuestionNumberOptionComponent', () => {
  let component: MADQuestionNumberOptionComponent;
  let fixture: ComponentFixture<MADQuestionNumberOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionNumberOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionNumberOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
