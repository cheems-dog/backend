import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as functions from '../functions';
import { UserModel } from '../models/user';
import { ImageModel } from '../models/image';

const config = functions.config();

const router = express.Router();

router.get('/:file([a-zA-Z0-9\-\_]+(\.)(jpeg|jpg|png|gif|webm|mp4))', async (req: express.Request, res: express.Response) => {
    const filename = req.params['file'] + req.params['1'];

    console.log(path.join(__dirname, '../storage/uploaded', filename));
    if (!fs.existsSync(path.join(__dirname, '../storage/uploaded', filename))) return res.status(404).send('Not found');
    
    const file = await ImageModel.findOne({ name: filename }).exec();
    const author = await UserModel.findById(file.author).exec();

    //res.send(`<h1>${filename}</h1><img src="/static/storage/${filename}">`);
    res.render('file', {
        file,
        author
    });
});

export default router;