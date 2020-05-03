import { Request, Response, NextFunction } from 'express';
import format from 'date-fns/format';
import api from '../api';

interface TV {
  name: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  genre_ids: Array<Number>;
  genres: Array<string>;
  videos: Videos;
}

interface Videos {
  results: Array<Video>;
}

interface Video {
  type: string;
  key: string;
}

const transformTv = (genres: any) => (tv: TV) => {
  return {
    ...tv,
    release_date: format(new Date(tv.first_air_date), 'dd.MM.yyyy'),
    poster_path: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
    genres:
      tv.genre_ids
        ?.slice(1, 3)
        .map(
          (genreId) => genres.find((genre: any) => genre.id === genreId)?.name
        ) || tv.genres,
  };
};

const transformSingleTv = (tv: TV) => {
  return {
    ...tv,
    title: tv.name,
    release_date: format(new Date(tv.first_air_date), 'dd.MM.yyyy'),
    backdrop_path: `https://image.tmdb.org/t/p/original${tv.backdrop_path}`,
    poster_path: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
    trailer:
      tv.videos?.results.find((video) => video.type === 'Trailer')?.key || '',
  };
};

const TvController = {
  index: async (req: Request, res: Response) => {
    const genres = req.app.locals.genres;
    const [popularTvResponse, topRatedTvResponse] = await Promise.all([
      api.popularTv(),
      api.topRatedTv(),
    ]);
    const popularTv = popularTvResponse.results.map(transformTv(genres));
    const topRatedTv = topRatedTvResponse.results.map(transformTv(genres));
    res.render('tv', { popularTv, topRatedTv });
  },
  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tvResponse = await api.tv(req.params.id);
      res.render('tv-single', {
        layout: 'movie-single',
        tv: transformSingleTv(tvResponse),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default TvController;
