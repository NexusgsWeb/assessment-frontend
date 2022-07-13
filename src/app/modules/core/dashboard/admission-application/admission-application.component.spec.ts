import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionApplicationComponent } from './admission-application.component';

describe('AdmissionApplicationComponent', () => {
  let component: AdmissionApplicationComponent;
  let fixture: ComponentFixture<AdmissionApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
