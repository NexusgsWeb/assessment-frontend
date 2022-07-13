import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionBlanksComponent } from './madquestion-blanks.component';

describe('MADQuestionBlanksComponent', () => {
  let component: MADQuestionBlanksComponent;
  let fixture: ComponentFixture<MADQuestionBlanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionBlanksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionBlanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
