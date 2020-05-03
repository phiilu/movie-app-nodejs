import express, { Response, NextFunction, Request } from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import _ from 'lodash';

import api from './api';
import MovieController from './controllers/MovieController';
import TvController from './controllers/TvController';
import ActorController from './controllers/ActorController';
import './helpers/handlebar';

interface Error {
  status?: number;
  message?: string;
}

const app = express();
const port = process.env.PORT || 5000;
const viewPath = path.join(__dirname, 'views');

app.locals.genres = [];

app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    partialsDir: path.join(__dirname, 'views', 'partials'),
  })
);
app.set('view engine', 'hbs');
app.set('views', viewPath);

app.use(express.static(path.join(__dirname, 'public')));
// fetch genres on first request and cache it
app.use(async (_req, _res, next) => {
  const genres = app.locals.genres;
  if (genres?.length <= 0) {
    const [movieGenre, tvGenre] = await api.genres();
    const genres: Array<Object> = _.uniqBy(
      [...movieGenre.genres, ...tvGenre.genres],
      'id'
    );
    app.locals.genres = genres;
  }
  next();
});

app.get('/', MovieController.index);
app.get('/movies/:id', MovieController.show);
app.get('/tv', TvController.index);
app.get('/tv/:id', TvController.show);
app.get('/actors', ActorController.index);
app.get('/actors/:id', ActorController.show);

if (app.get('env') === 'development') {
  app.use(function (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(port, function () {
  console.log(`App is listening on port ${port}!`);
});

process.on('SIGINT', function () {
  console.log('Caught interrupt signal, exiting ...');
  process.exit();
});
