const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const path = require('path')
// import express from 'express';
// import body from 'body-parser';
// import morgan from 'morgan';
// import cookie from 'cookie-parser';
// import path, {dirname} from 'path';
// import { fileURLToPath } from 'url';

const app = express();

app.use(body.json());
app.use(morgan('dev'));
app.use(express.static('dist'));
app.use(express.static('public'));
// app.use(express.static('dist/public'));
app.use(express.static('public/server'));
app.use(cookie());

app.use((_, res) => {
    // const __dirname = dirname(fileURLToPath(import.meta.url));
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port);
