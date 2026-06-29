import { Component, input } from '@angular/core';
import { MoviesListResponse } from '../../types/movies-list-response';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movies-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList {
  BASE_PATH = environment.baseUrl;

  movies = input<MoviesListResponse>([])
}
