import { Request, Response } from 'express';
import fetch from 'node-fetch';

const API_KEY = process.env.TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/';
const tmdb = {
  movies: (): Promise<any> => {
    return fetch(
      `${BASE_URL}movie/popular?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
  },
};

interface Movie {
  poster_path: string;
}

const MovieController = {
  index: async (_req: Request, res: Response) => {
    try {
      const movieResponse = await tmdb.movies();
      const movies = movieResponse.results.map((movie: Movie) => {
        return {
          ...movie,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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
