import webpack from 'webpack';
import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';

import config from '../webpack.config.js';

const port = 3000;
const app = express();
const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    chunks: false
  }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('*', (req, res) => {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '/dist/index.html')));
  res.end();
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) console.log(err);
  console.info('Served at: http://0.0.0.0:%s/', port);
});
