import { Request, Response, NextFunction } from 'express';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/differenceInYears';
import _ from 'lodash';
import api from '../api';
import DataCache from '../util/DataCache';

interface Actor {
  name: string;
  biography: string;
  profile_path: string;
  known_for: Array<KnownFor>;
  birthday: string;
  place_of_birth: string;
  combined_credits: CombinedCreits;
}

interface KnownFor {
  name: string;
  title: string;
}

interface CombinedCreits {
  cast: Array<Cast>;
}

interface Cast {
  id: number;
  popularity: number;
  poster_path: string;
  title?: string;
  name?: string;
  release_date: string;
  first_air_date?: string;
  character: string;
  media_type: string;
}

const transformActor = (actor: Actor) => {
  return {
    ...actor,
    profile_path: actor.profile_path
      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
      : `https://dummyimage.com/500x750/cbd5e0/1a202c.png&text=Profile+Image+Not+Found`,
    known_for: actor.known_for?.map((kf) => kf.name || kf.title),
  };
};

const transformSingleActor = (actor: Actor) => {
  return {
    ...actor,
    profile_path: actor.profile_path
      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
      : `https://dummyimage.com/500x750/cbd5e0/1a202c.png&text=Profile+Image+Not+Found`,
    birthdayLine: actor.birthday
      ? `${format(new Date(actor.birthday), 'dd.MM.yyyy')} (${differenceInYears(
          new Date(),
          new Date(actor.birthday)
        )} years old) in ${actor.place_of_birth}`
      : 'Sorry, we could not get this information 😔',
    knownForMovies: getKnownForMovies(actor.combined_credits.cast),
    credits: getCredits(actor.combined_credits.cast),
  };
};

function getKnownForMovies(cast: Array<Cast>) {
  const copyCast = Array.from(_.uniqBy(cast, 'id'));
  copyCast.sort((c1, c2) => c2.popularity - c1.popularity);
  return copyCast.slice(0, 5).map((c) => ({
    id: c.id,
    title: c.title || c.name,
    poster_path: c.poster_path,
    popularity: c.popularity,
    link: c.media_type === 'movie' ? `/movies/${c.id}` : `/tv/${c.id}`,
  }));
}

function getCredits(cast: Array<Cast>) {
  const copyCast = Array.from(_.uniqBy(cast, 'id'))
    .map((c: Cast) => {
      if (c.first_air_date) {
        return {
          ...c,
          release_date: c.first_air_date,
        };
      }
      return c;
    })
    .filter((c: Cast) => {
      return (
        c.release_date !== undefined &&
        c.release_date !== null &&
        c.release_date !== ''
      );
    });

  copyCast.sort(
    (c1, c2) =>
      new Date(c2.release_date).getTime() - new Date(c1.release_date).getTime()
  );

  return copyCast.map((c) => {
    return {
      id: c.id,
      title: c.title || c.name,
      character: c.character ? ` as ${c.character} ` : '',
      releaseYear: c.release_date
        ? new Date(c.release_date).getFullYear()
        : 'Unknown',
      link: c.media_type === 'movie' ? `/movies/${c.id}` : `/tv/${c.id}`,
    };
  });
}

const actorsCache = new DataCache(api.popularActors, false, 10);
const actorCache = new DataCache(api.actor, true);

const ActorController = {
  index: async (_req: Request, res: Response) => {
    const actorsResponse = await actorsCache.getData();
    res.render('actor', {
      actors: actorsResponse.results.map(transformActor),
      active: {
        actor: true,
      },
      meta: {
        title: 'Actors',
      },
    });
  },
  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actorResponse = await actorCache.getData(req.params.id);
      const actor = transformSingleActor(actorResponse);
      res.render('actor-single', {
        actor,
        active: {
          actor: true,
        },
        meta: {
          title: actor.name,
          description: actor.biography,
          image: actor.profile_path,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ActorController;
