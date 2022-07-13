import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettingsLebcirComponent } from './question-settings-lebcir.component';

describe('QuestionSettingsLebcirComponent', () => {
  let component: QuestionSettingsLebcirComponent;
  let fixture: ComponentFixture<QuestionSettingsLebcirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSettingsLebcirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingsLebcirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
