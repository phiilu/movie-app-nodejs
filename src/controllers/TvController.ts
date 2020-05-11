import { Request, Response, NextFunction } from 'express';
import format from 'date-fns/format';
import api from '../api';
import DataCache from '../util/DataCache';

interface TV {
  name: string;
  overview: string;
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
    shortTitle:
      tv.name.length > 20 ? tv.name.substring(0, 20) + '...' : tv.name,
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
    shortTitle:
      tv.name.length > 20 ? tv.name.substring(0, 20) + '...' : tv.name,
    release_date: format(new Date(tv.first_air_date), 'dd.MM.yyyy'),
    backdrop_path: `https://image.tmdb.org/t/p/original${tv.backdrop_path}`,
    poster_path: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
    trailer:
      tv.videos?.results.find((video) => video.type === 'Trailer')?.key || '',
  };
};

const popularTvCache = new DataCache(api.popularTv, false, 10);
const topRatedTvCache = new DataCache(api.topRatedTv, false, 10);
const tvCache = new DataCache(api.tv);

const TvController = {
  index: async (req: Request, res: Response) => {
    const genres = req.app.locals.genres;
    const [popularTvResponse, topRatedTvResponse] = await Promise.all([
      popularTvCache.getData(),
      topRatedTvCache.getData(),
    ]);
    const popularTv = popularTvResponse.results.map(transformTv(genres));
    const topRatedTv = topRatedTvResponse.results.map(transformTv(genres));
    res.render('tv', {
      popularTv,
      topRatedTv,
      active: {
        tv: true,
      },
      meta: {
        title: 'TV Shows',
      },
    });
  },
  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tvResponse = await tvCache.getData(req.params.id);
      const tv = transformSingleTv(tvResponse);
      res.render('tv-single', {
        layout: 'movie-single',
        tv,
        active: {
          tv: true,
        },
        meta: {
          title: tv.title,
          description: tv.overview,
          image: tv.poster_path,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default TvController;
