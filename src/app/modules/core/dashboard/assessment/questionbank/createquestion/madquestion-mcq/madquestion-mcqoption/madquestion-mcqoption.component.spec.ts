import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionMCQoptionComponent } from './madquestion-mcqoption.component';

describe('MADQuestionMCQoptionComponent', () => {
  let component: MADQuestionMCQoptionComponent;
  let fixture: ComponentFixture<MADQuestionMCQoptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionMCQoptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionMCQoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
