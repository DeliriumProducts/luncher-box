const express = require('express');
const next = require('next');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '/../.env')
});

const PORT = Number(process.env.FRONTEND_PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost';
const ENV = process.env.NODE_ENV || 'development';

const dev = ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/category/:categoryId', (req, res) => {
      const actualPage = '/category';
      const queryParams = Object.assign({}, req.params, {
        categoryId: req.params.categoryId
      });

      app.render(req, res, actualPage, queryParams);
    });

    server.get('/admin/category/:categoryId', (req, res) => {
      const actualPage = '/admin/category';
      const queryParams = Object.assign({}, req.params, {
        categoryId: req.params.categoryId
      });

      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) {
        throw err;
      }

      console.clear();

      console.log(
        `🥩 Luncher-box frontend running on ${FRONTEND_URL} in ${ENV}`
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
