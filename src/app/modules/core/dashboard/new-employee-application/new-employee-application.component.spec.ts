import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeeApplicationComponent } from './new-employee-application.component';

describe('NewEmployeeApplicationComponent', () => {
  let component: NewEmployeeApplicationComponent;
  let fixture: ComponentFixture<NewEmployeeApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEmployeeApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployeeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
