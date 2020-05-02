import { Request, Response, NextFunction } from 'express';
import format from 'date-fns/format';
import api from '../api';

interface Movie {
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  genre_ids: Array<object>;
  genres: Array<object>;
  videos: Videos;
  credits: Credits;
}

interface Videos {
  results: Array<Video>;
}

interface Video {
  type: string;
  key: string;
}

interface Credits {
  cast: Array<any>;
}

const transformMovie = (genres: any) => (movie: Movie) => {
  return {
    ...movie,
    release_date: format(new Date(movie.release_date), 'dd.MM.yyyy'),
    backdrop_path: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    genres:
      movie.genre_ids
        ?.slice(1, 3)
        .map(
          (genreId) => genres.find((genre: any) => genre.id === genreId)?.name
        ) || movie.genres,
    trailer:
      movie.videos?.results.find((video) => video.type === 'Trailer')?.key ||
      '',
    credits: movie.credits
      ? {
          ...movie.credits,
          cast: movie.credits.cast.slice(0, 5),
        }
      : null,
  };
};

const MovieController = {
  index: async (req: Request, res: Response, next: NextFunction) => {
    const genres = req.app.locals.genres;
    try {
      const [
        popularMoviesResponse,
        nowPlayingMoviesResponse,
      ] = await Promise.all([api.popularMovies(), api.nowPlayingMovies()]);

      const popularMovies = popularMoviesResponse.results.map(
        transformMovie(genres)
      );

      const nowPlayingMovies = nowPlayingMoviesResponse.results.map(
        transformMovie(genres)
      );
      res.render('home', { popularMovies, nowPlayingMovies });
    } catch (error) {
      next(error);
    }
  },
  show: async (req: Request, res: Response, next: NextFunction) => {
    const genres = req.app.locals.genres;
    try {
      const movie = await api.movie(req.params.id);
      res.render('movie-single', {
        layout: 'movie-single.hbs',
        movie: transformMovie(genres)(movie),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default MovieController;
