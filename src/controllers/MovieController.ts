import { Request, Response } from 'express';
import api from '../api';

interface Movie {
  poster_path: string;
  genre_ids: Array<object>;
}

const MovieController = {
  index: async (req: Request, res: Response) => {
    const genres = req.app.locals.genres;
    console.log(genres);
    try {
      const movieResponse = await api.movies();
      const movies = movieResponse.results.map((movie: Movie) => {
        return {
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genres: movie.genre_ids.map(
            (genreId) => genres.find((genre: any) => genre.id === genreId)?.name
          ),
        };
      });
      console.log(movies);
      res.render('home', { movies });
    } catch (error) {
      res.render('error');
    }
  },
};

export default MovieController;
