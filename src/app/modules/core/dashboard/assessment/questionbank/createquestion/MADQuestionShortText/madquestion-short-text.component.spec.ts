import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionShortTextComponent } from './madquestion-short-text.component';

describe('MADQuestionShortTextComponent', () => {
  let component: MADQuestionShortTextComponent;
  let fixture: ComponentFixture<MADQuestionShortTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionShortTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionShortTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
