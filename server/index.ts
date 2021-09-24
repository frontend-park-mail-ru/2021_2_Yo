import express from "express"
import body from "body-parser"
import morgan from "morgan";
import cookie from "cookie-parser";

const app = express();

app.use(body.json())
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.static('dist/public'));
app.use(express.static('public/server'));
app.use(cookie());

app.post('/login', (req, res) => {
//
});

app.post('/signup', (req, res) => {
//
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening at: http://localhost:${port}`);
});
