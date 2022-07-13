import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettingsUsacirComponent } from './question-settings-usacir.component';

describe('QuestionSettingsUsacirComponent', () => {
  let component: QuestionSettingsUsacirComponent;
  let fixture: ComponentFixture<QuestionSettingsUsacirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSettingsUsacirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingsUsacirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
