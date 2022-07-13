import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionTFComponent } from './madquestion-tf.component';

describe('MADQuestionTFComponent', () => {
  let component: MADQuestionTFComponent;
  let fixture: ComponentFixture<MADQuestionTFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionTFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionTFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
