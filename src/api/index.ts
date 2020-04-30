import fetch from 'node-fetch';

const API_KEY = process.env.TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/';

const api = {
  genres: (): Promise<any> => {
    return fetch(`${BASE_URL}genre/movie/list?api_key=${API_KEY}`).then((res) =>
      res.json()
    );
  },
  popularMovies: (): Promise<any> => {
    return fetch(
      `${BASE_URL}movie/popular?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
  },
  nowPlayingMovies: (): Promise<any> => {
    return fetch(
      `${BASE_URL}movie/now_playing?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
  },
  movie: (id: string | number): Promise<any> => {
    return fetch(
      `${BASE_URL}movie/${id}?api_key=${API_KEY}&page=1&append_to_response=videos,credits,genres`
    ).then((res) => res.json());
  },
};

export default api;
