import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionNumberComponent } from './madquestion-number.component';

describe('MADQuestionNumberComponent', () => {
  let component: MADQuestionNumberComponent;
  let fixture: ComponentFixture<MADQuestionNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
