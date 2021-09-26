import express from "express"
import body from "body-parser"
import morgan from "morgan";
import cookie from "cookie-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from "path";

const app = express();

app.use(body.json())
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.static('dist/public'));
app.use(express.static('public/server'));
app.use(cookie());

app.use((req, res) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening at: http://localhost:${port}`);
});
