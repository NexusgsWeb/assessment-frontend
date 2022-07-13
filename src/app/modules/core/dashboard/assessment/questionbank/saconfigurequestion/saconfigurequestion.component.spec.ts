import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAconfigurequestionComponent } from './saconfigurequestion.component';

describe('SAconfigurequestionComponent', () => {
  let component: SAconfigurequestionComponent;
  let fixture: ComponentFixture<SAconfigurequestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SAconfigurequestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SAconfigurequestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
