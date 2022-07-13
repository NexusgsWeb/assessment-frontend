import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettingsDialogComponent } from './question-settings-dialog.component';

describe('QuestionSettingsDialogComponent', () => {
  let component: QuestionSettingsDialogComponent;
  let fixture: ComponentFixture<QuestionSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
