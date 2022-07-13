import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionNumberEditComponent } from './madquestion-number-edit.component';

describe('MADQuestionNumberEditComponent', () => {
  let component: MADQuestionNumberEditComponent;
  let fixture: ComponentFixture<MADQuestionNumberEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionNumberEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionNumberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
