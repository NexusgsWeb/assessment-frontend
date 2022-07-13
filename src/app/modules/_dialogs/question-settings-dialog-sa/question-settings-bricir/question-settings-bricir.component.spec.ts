import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettingsBricirComponent } from './question-settings-bricir.component';

describe('QuestionSettingsBricirComponent', () => {
  let component: QuestionSettingsBricirComponent;
  let fixture: ComponentFixture<QuestionSettingsBricirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSettingsBricirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSettingsBricirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
