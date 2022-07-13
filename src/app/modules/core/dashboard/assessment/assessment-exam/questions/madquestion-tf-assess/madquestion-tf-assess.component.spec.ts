import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionTfAssessComponent } from './madquestion-tf-assess.component';

describe('MadquestionTfAssessComponent', () => {
  let component: MadquestionTfAssessComponent;
  let fixture: ComponentFixture<MadquestionTfAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionTfAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionTfAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
