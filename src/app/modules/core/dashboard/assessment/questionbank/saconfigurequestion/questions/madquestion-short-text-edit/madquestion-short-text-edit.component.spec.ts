import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionShortTextEditComponent } from './madquestion-short-text-edit.component';

describe('MADQuestionShortTextEditComponent', () => {
  let component: MADQuestionShortTextEditComponent;
  let fixture: ComponentFixture<MADQuestionShortTextEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionShortTextEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionShortTextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
