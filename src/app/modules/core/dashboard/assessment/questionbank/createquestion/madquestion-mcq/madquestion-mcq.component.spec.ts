import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionMCQComponent } from './madquestion-mcq.component';

describe('MADQuestionMCQComponent', () => {
  let component: MADQuestionMCQComponent;
  let fixture: ComponentFixture<MADQuestionMCQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionMCQComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionMCQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
