import * as express from 'express';
import * as formData from 'express-form-data';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import * as functions from '../functions';

const config = functions.config();

const router = express.Router();

router.get('/:file', (req: express.Request, res: express.Response) => {
    if(!fs.existsSync(path.join(__dirname, '../storage', req.params.file))) return res.status(404);

    res.send(`<h1>${req.params.file}</h1><img src="/static/storage/${req.params.file}">`);
});

export default router;