import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSchoolsComponent } from './view-schools.component';

describe('ViewSchoolsComponent', () => {
  let component: ViewSchoolsComponent;
  let fixture: ComponentFixture<ViewSchoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSchoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
