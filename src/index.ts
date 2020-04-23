import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';

import MovieController from './controllers/MovieController';
import TvController from './controllers/TvController';
import ActorController from './controllers/ActorController';

const app = express();
const port = process.env.PORT || 5000;
const viewPath = path.join(__dirname, 'views');

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

app.get('/', MovieController.index);
app.get('/tv', TvController.index);
app.get('/actors', ActorController.index);

app.listen(port, function () {
  console.log(`App is listening on port ${port}!`);
});

process.on('SIGINT', function () {
  console.log('Caught interrupt signal, exiting ...');
  process.exit();
});
