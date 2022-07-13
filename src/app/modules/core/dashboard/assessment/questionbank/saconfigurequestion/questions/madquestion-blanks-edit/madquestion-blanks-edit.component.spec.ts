import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionBlanksEditComponent } from './madquestion-blanks-edit.component';

describe('MADQuestionBlanksEditComponent', () => {
  let component: MADQuestionBlanksEditComponent;
  let fixture: ComponentFixture<MADQuestionBlanksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionBlanksEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionBlanksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
