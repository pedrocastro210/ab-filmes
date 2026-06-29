import { Component, computed, inject, input, linkedSignal, signal, WritableSignal } from '@angular/core';
import { MoviesApi } from '../../services/movies-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { tap } from 'rxjs';
import { FavoritesApi } from '../../../../shared/services/favorites-api';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _moviesApi = inject(MoviesApi);
  private readonly _favoritesApi = inject(FavoritesApi);

  readonly BASE_URL = environment.baseUrl;

  id = input.required<string>();

  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._moviesApi.getMovieDetails(+params),
  });

  movieDetails = linkedSignal(() => {
    const ERROR_ON_RESPONSE = !!this.movieDetailsResource.error();

    if(ERROR_ON_RESPONSE) return undefined;

    const movieDetailsList = this.movieDetailsResource.value();

    return movieDetailsList;
  })  

  currentRating = signal<number | undefined>(undefined);

  starsStatusFilled = computed(() => {
    const rating = this.currentRating() ?? 0;

    const boolArray = [0, 1, 2, 3, 4].map((index) => index < rating);

    return boolArray;
  });

  rateMovieResource = rxResource({
    params: () => {
      const rating = this.currentRating() ?? 0;

      if(rating > 0) return { id: +this.id(), rating }; 
      
      return undefined;
    },
    stream: ({ params }) => 
      this._moviesApi.rateMovie(params.id, params.rating)
      .pipe(tap((movieUpdated) => this.movieDetails.set(movieUpdated)))
  });

  isMovieFavoriteResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._favoritesApi.isMovieInFavorite(+params),
  })

  isFavorite = linkedSignal(() => {
    const ERROR_ON_RESPONSE = !!this.isMovieFavoriteResource.error();

    if(ERROR_ON_RESPONSE) return false;

    return this.isMovieFavoriteResource.value() ?? false;
  });

  toggleFavoriteParams = signal<boolean | undefined>(undefined)

  toggleMovieFavoriteResource = rxResource({
    params: () => {
      const status = this.toggleFavoriteParams();

      if(status === undefined) return undefined;

      return {
        currentFavoritesStatus: status,
        movieId: +this.id(),
      }
    },
    stream: ({ params }) => 
      this._favoritesApi
      .toggleMovieFavorite(params.currentFavoritesStatus, params.movieId)
      .pipe(tap(() => this.isFavorite.update((currentValue) => !currentValue))),
  })

  toggleFavorite() {
    this.toggleFavoriteParams.set(this.isFavorite());

  };

  updateRating(newRating: number) {
    if(newRating === this.currentRating()) {
      this.currentRating.set(0);
    } else {
      this.currentRating.set(newRating)
    }
  };
}