import * as express from 'express';
import * as prettifyBytes from 'pretty-bytes';
import * as dirSize from '@sandervandriel/dir-size';
import * as path from 'path';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import * as url from 'url';
import { UserModel, User } from '../../models/user';

const router = express.Router();

router.get('/fileCount', async (req: express.Request, res: express.Response) => {
    res.status(200).json({
        fileCount: fs.readdirSync(path.join(__dirname, '../../storage/uploaded')).length
    });
});

router.get('/fileCount/badge', async (req: express.Request, res: express.Response) => {
    res.setHeader('content-type', 'image/svg+xml');

    res.send(await fetch(`https://img.shields.io/badge/Files%20uploaded-${fs.readdirSync(path.join(__dirname, '../../storage/uploaded')).length}-green`).then(res => res.text()))
});

router.get('/fileSize', async (req: express.Request, res: express.Response) => {
    const bytes = fs.statSync(path.join(__dirname, '../../storage/uploaded')).size;

    res.status(200).json({
        fileSize: bytes,
        pretty: prettifyBytes(bytes)
    });
});

router.get('/fileSize/badge', async (req: express.Request, res: express.Response) => {
    const bytes = await dirSize.default(path.join(__dirname, '../../storage/uploaded'));

    const parameters = {
        style: 'plastic'
    }

    if(req.query.style && req.query.style !== '') (parameters as any).style = req.query.style;
    if(req.query.logo && req.query.logo !== '') (parameters as any).logo = req.query.logo;
    if(req.query.logoColor && req.query.logoColor !== '') (parameters as any).logoColor = req.query.logoColor;
    if(req.query.logoWidth && req.query.logoWidth !== '') (parameters as any).logoWidth = req.query.logoWidth;
    if(req.query.labelColor && req.query.labelColor !== '') (parameters as any).labelColor = req.query.labelColor;
    if(req.query.color && req.query.color !== '') (parameters as any).color = req.query.color;

    res.send(await fetch(`https://img.shields.io/badge/Files%20size-${prettifyBytes(bytes.size)}-green?${new url.URLSearchParams(parameters).toString()}`).then(res => res.text()))
});

export default router;