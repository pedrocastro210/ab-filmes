import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMovies } from './explore-movies';

describe('ExploreMovies', () => {
  let component: ExploreMovies;
  let fixture: ComponentFixture<ExploreMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreMovies],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreMovies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
