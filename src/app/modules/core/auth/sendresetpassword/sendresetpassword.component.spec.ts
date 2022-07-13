import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendresetpasswordComponent } from './sendresetpassword.component';

describe('SendresetpasswordComponent', () => {
  let component: SendresetpasswordComponent;
  let fixture: ComponentFixture<SendresetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendresetpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendresetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
