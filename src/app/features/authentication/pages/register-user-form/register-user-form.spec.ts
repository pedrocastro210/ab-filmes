import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserForm } from './register-user-form';

describe('RegisterUserForm', () => {
  let component: RegisterUserForm;
  let fixture: ComponentFixture<RegisterUserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterUserForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterUserForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
