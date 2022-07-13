import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewschoolItemComponent } from './viewschool-item.component';

describe('ViewschoolItemComponent', () => {
  let component: ViewschoolItemComponent;
  let fixture: ComponentFixture<ViewschoolItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewschoolItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewschoolItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
