import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as functions from '../../functions';
import { UserModel } from '../../models/user';
import { ImageModel } from '../../models/image';

const config = functions.config();

interface File {
    fieldName: string;
    originalFilename: string;
    path: string;
    headers: object;
    size: number;
    name: string;
    type: string;
}

const allowedMIMETypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/webm',
    'video/mp4'
];

const createId = (length = 6) => {
    const characters = [
        'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E',
        'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i',
        'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N',
        'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r',
        'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W',
        'w', 'X', 'x', 'Y', 'y', 'Z', 'z', '1', '2',
        '3', '4', '5', '6', '7', '8', '9', '0', '-',
        '_'
    ];
    let string = '';

    for (let i = 0; i < length; i++) string += characters[Math.floor(Math.random() * characters.length)];

    return string;
}

const createFileName = (file: File) => {
    return createId() + `.${file.name.split('.')[file.name.split('.').length - 1]}`;
}

const router = express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {
    const file = (req.files.file as any) as File;

    console.log(file);

    if (!(req.body as object).hasOwnProperty('key') || !req.body.key || req.body.key == '') {
        return res.status(401).json({
            success: false,
            data: {
                message: 'You didn\'t provided token for authentication',
                fix: 'Provide your private token or obtain it at https://discord.gg/3WrP5BUfcw'
            }
        });
    }

    const user = await UserModel.findOne({ token: req.body.key }).exec();

    if (user === null) {
        return res.status(403).json({
            success: false,
            data: {
                message: 'Invalid token',
                fix: 'This token does not have permissions to use this endpoint. You entered the wrong token, or you have been permanently banned from using our service'
            }
        });
    }

    if (!file) {
        return res.status(400).json({
            success: false,
            data: {
                message: 'No files uploaded',
                fix: 'Upload files'
            }
        });
    }

    if (file.size > 10 * 1000000) {
        return res.status(400).json({
            success: false,
            data: {
                message: 'Uploaded file too large',
                fix: 'Upload a file with less size (maximum 10MB)'
            }
        });
    }

    if (!allowedMIMETypes.includes(file.type)) {
        return res.status(415).json({
            success: false,
            data: {
                message: 'Uploaded file too large',
                fix: 'We do not support this file type'
            }
        });
    }

    try {
        const filename = createFileName(file);

        fs.copyFileSync(file.path, path.join(__dirname, '../../storage/upload', filename));

        await ImageModel.create({
            name: filename,
            author: user._id
        });
        await UserModel.findByIdAndUpdate(user._id, { $inc: { 'uploadedFiles': 1 } }).exec();

        res.status(200).json({
            success: true,
            data: {
                message: 'Success',
                url: `${config.hostname}/${filename}`,
                thumbnail: `${config.hostname}/api/thumbnail/${filename}`,
                delete: `${config.hostname}/${filename}`
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: {
                message: 'Unexpected error',
                fix: 'Bug has been reported to staff, please wait and try again'
            }
        });
    }
});

router.delete('/delete', async(req: express.Request, res: express.Response) => {
    if (!(req.body as object).hasOwnProperty('key') || !req.body.key || req.body.key == '') {
        return res.status(401).json({
            success: false,
            data: {
                message: 'You didn\'t provided token for authentication',
                fix: 'Provide your private token or obtain it at https://discord.gg/3WrP5BUfcw'
            }
        });
    }
    
    const user = await UserModel.findOne({ token: req.body.key }).exec();
    const image = await ImageModel.findOne({ name: req.params.file }).exec();
    
    if (user === null) {
        return res.status(403).json({
            success: false,
            data: {
                message: 'Invalid token',
                fix: 'This token does not have permissions to use this endpoint. You entered the wrong token, or you have been permanently banned from using our service'
            }
        });
    }
    
    if (image === null) {
        return res.status(404).json({
            success: false,
            data: {
                message: 'Image not found',
                fix: 'This image was not found on the server. It may be already deleted'
            }
        });
    }
    
    if(user._id.toString() !== image.author.toString()) {
        return res.status(403).json({
            success: false,
            data: {
                message: 'You can\'t delete this file',
                fix: 'Only the file owner and website admins can delete this file'
            }
        });
    }
    
    try {
        await ImageModel.findByIdAndDelete(image._id).exec();
        await UserModel.findByIdAndUpdate(user._id, { $inc: { 'uploadedFiles': -1 } }).exec();

        res.status(200).json({
            success: true,
            data: {
                message: 'Successfully deleted'
            }
        })
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: {
                message: 'Unexpected error',
                fix: 'Bug has been reported to staff, please wait and try again'
            }
        });
    }
});

export default router;