import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAconfigurequestionREMARKITEMComponent } from './saconfigurequestion-remarkitem.component';

describe('SAconfigurequestionREMARKITEMComponent', () => {
  let component: SAconfigurequestionREMARKITEMComponent;
  let fixture: ComponentFixture<SAconfigurequestionREMARKITEMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SAconfigurequestionREMARKITEMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SAconfigurequestionREMARKITEMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
