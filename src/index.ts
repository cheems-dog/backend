import * as express from 'express';
import * as chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import * as path from 'path';
import * as formData from 'express-form-data';
import * as os from 'os';
import * as functions from './functions';
import routes from './routes';

const app = express();
const config = functions.config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static/storage', express.static(path.join(__dirname, 'storage')));
app.use(formData.parse({
    uploadDir: os.tmpdir(),
    autoClean: true
}));

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
});

app.use('/', routes);

app.listen(8081, () => {
    console.log(`${chalk.white.bgGreen(logSymbols.success)} Server started on port ${chalk.cyan('8081')}`);
});