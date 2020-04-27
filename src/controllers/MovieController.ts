import { Request, Response } from 'express';
import format from 'date-fns/format';
import api from '../api';

interface Movie {
  release_date: string;
  poster_path: string;
  genre_ids: Array<object>;
}

const transformMovie = (genres: any) => (movie: Movie) => {
  return {
    ...movie,
    release_date: format(new Date(movie.release_date), 'dd.MM.yyyy'),
    poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    genres: movie.genre_ids
      .slice(1, 3)
      .map(
        (genreId) => genres.find((genre: any) => genre.id === genreId)?.name
      ),
  };
};

const MovieController = {
  index: async (req: Request, res: Response) => {
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

      console.log(popularMovies);
      res.render('home', { popularMovies, nowPlayingMovies });
    } catch (error) {
      console.log(error);
      res.render('error');
    }
  },
  show: async (req: Request, res: Response) => {
    const movie = await api.movie(req.params.id);
    console.log(movie);
    res.render('movie-single', { movie });
  },
};

export default MovieController;
