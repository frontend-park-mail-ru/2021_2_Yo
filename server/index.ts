import express from "express"
import body from "body-parser"
import morgan from "morgan";
import cookie from "cookie-parser";
import {v4 as uuid} from "uuid"

const app = express();

app.use(body.json())
app.use(morgan('dev'))
app.use(express.static("./public"));
app.use(express.static("./dist/public"));
app.use(cookie());

type User = {
    id: string,
    password: string,
}
const users = new Map<string, User>([['email@mail.ru', {id: "1", password: "password"}],
    ['test@mail.ru', {id: "2", password: "pass"}]])
const ids = new Map<string, string>([["1", "email@mail.ru"]])

app.post('/login', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;

    if (!password || !email) {
        return res.status(400).json({error: 'Не указан E-Mail или пароль'});
    }
    const user = users.get(email)
    if (!user || user.password !== password) {
        return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
    }

    const id = uuid();
    ids.set(id, email)

    res.cookie('authCookie', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    return res.status(200).json({id});
});

app.get('/test', (req, res) => {
    const id = req.cookies.authCookie;
    const email = ids.get(id)
    if (!email || !users.has(email)) {
        return res.status(401).end();
    }
    return res.status(200).json({id});
});

app.post('/signup', (req, res) => {
//
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});
