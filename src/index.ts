import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';

import MovieController from './controllers/MovieController';

const app = express();
const port = 3000;
const viewPath = path.join(__dirname, 'views');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', viewPath);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', MovieController.index);

app.listen(port, function () {
  console.log('App is listening on port 3000!');
});
