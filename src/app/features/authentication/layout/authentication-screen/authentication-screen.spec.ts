import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationScreen } from './authentication-screen';

describe('AuthenticationScreen', () => {
  let component: AuthenticationScreen;
  let fixture: ComponentFixture<AuthenticationScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
