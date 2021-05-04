import * as express from 'express';
import * as chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import * as path from 'path';
import * as formData from 'express-form-data';
import * as os from 'os';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as functions from './functions';
import * as passportHelpers from './helpers/passport';
import routes from './routes';

const app = express();
const config = functions.config();

mongoose.connect(config.mongodb.host, {
    useNewUrlParser: true,
    user: config.mongodb.username,
    pass: config.mongodb.password,
    dbName: config.mongodb.database
});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log(`${chalk.white.bgGreen(logSymbols.success)} Connected to database, using database name: ${chalk.cyan(config.mongodb.database)}`);
});

passportHelpers.configure(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/static/storage', express.static(path.join(__dirname, 'storage')));
app.use(formData.parse({
    uploadDir: os.tmpdir(),
    autoClean: true
}));
app.use(bodyParser.json());
app.use(
    session({
        secret: config.loginSecret,
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
});

app.use('/', routes);

// app.use((req: express.Request, res: express.Response) => {
//     res.status(404).send('Not found')
// });

app.listen(8081, () => {
    console.log(`${chalk.white.bgGreen(logSymbols.success)} Server started on port ${chalk.cyan('8081')}`);
});