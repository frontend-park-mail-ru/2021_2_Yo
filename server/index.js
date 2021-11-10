const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const path = require('path')

const app = express();

app.use(body.json());
app.use(morgan('dev'));
app.use(express.static('dist'));
app.use(express.static('public'));
app.use(express.static('public/server'));
app.use(cookie());

app.use((_, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port);
