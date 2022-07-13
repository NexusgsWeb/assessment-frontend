import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionMCQEditComponent } from './madquestion-mcqedit.component';

describe('MADQuestionMCQEditComponent', () => {
  let component: MADQuestionMCQEditComponent;
  let fixture: ComponentFixture<MADQuestionMCQEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionMCQEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionMCQEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
