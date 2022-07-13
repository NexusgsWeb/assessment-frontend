import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionDateAssessComponent } from './madquestion-date-assess.component';

describe('MadquestionDateAssessComponent', () => {
  let component: MadquestionDateAssessComponent;
  let fixture: ComponentFixture<MadquestionDateAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionDateAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionDateAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
