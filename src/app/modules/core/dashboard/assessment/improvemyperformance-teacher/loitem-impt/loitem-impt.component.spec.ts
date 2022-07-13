import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOItemIMPTComponent } from './loitem-impt.component';

describe('LOItemIMPTComponent', () => {
  let component: LOItemIMPTComponent;
  let fixture: ComponentFixture<LOItemIMPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LOItemIMPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LOItemIMPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
