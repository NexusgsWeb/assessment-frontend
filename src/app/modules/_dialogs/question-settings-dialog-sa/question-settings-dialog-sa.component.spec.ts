import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettingsDialogSaComponent } from './question-settings-dialog-sa.component';

describe('QuestionSettingsDialogSaComponent', () => {
  let component: QuestionSettingsDialogSaComponent;
  let fixture: ComponentFixture<QuestionSettingsDialogSaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSettingsDialogSaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingsDialogSaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
