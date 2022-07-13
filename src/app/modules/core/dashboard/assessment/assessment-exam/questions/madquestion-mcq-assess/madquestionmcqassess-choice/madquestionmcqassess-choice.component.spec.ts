import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionmcqassessChoiceComponent } from './madquestionmcqassess-choice.component';

describe('MadquestionmcqassessChoiceComponent', () => {
  let component: MadquestionmcqassessChoiceComponent;
  let fixture: ComponentFixture<MadquestionmcqassessChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionmcqassessChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionmcqassessChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
