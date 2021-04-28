import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as functions from '../functions';

const config = functions.config();

const router = express.Router();

router.get('/:file([a-zA-Z0-9\-\_]+(\.)(jpeg|jpg|png|gif|webm|mp4))', (req: express.Request, res: express.Response) => {
    const filename = req.params['file'] + req.params['1'];

    if(!fs.existsSync(path.join(__dirname, '../storage', filename))) return res.status(404);

    //res.send(`<h1>${filename}</h1><img src="/static/storage/${filename}">`);
    res.render('file', {
        file: {
            filename
        }
    });
});

export default router;