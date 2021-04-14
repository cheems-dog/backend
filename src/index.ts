import * as express from 'express';
import * as chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import * as path from 'path';
import * as fileUpload from 'express-fileupload';
import upload from './api/upload';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
});

app.use('/upload', upload);

app.listen(84, () => {
    console.log(`${chalk.white.bgGreen(logSymbols.success)} Server started on port ${chalk.cyan('80')}`);
});