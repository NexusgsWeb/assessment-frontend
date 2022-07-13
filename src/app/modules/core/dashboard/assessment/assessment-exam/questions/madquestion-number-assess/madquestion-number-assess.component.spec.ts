import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionNumberAssessComponent } from './madquestion-number-assess.component';

describe('MadquestionNumberAssessComponent', () => {
  let component: MadquestionNumberAssessComponent;
  let fixture: ComponentFixture<MadquestionNumberAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionNumberAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionNumberAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
