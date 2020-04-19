import express from 'express';
import path from 'path';
import mustacheExpress from 'mustache-express';

import './styles/index.css';

import MovieController from './controllers/MovieController';

const app = express();
const port = 3000;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', MovieController.index);

app.listen(port, function() {
  console.log('App is listening on port 3000!');
});
