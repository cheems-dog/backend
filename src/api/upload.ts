import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs';

const allowedMIMETypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/webm',
    'video/mp4'
];

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
    const file = (req.files.file) as fileUpload.UploadedFile;

    if ((req.body as object).hasOwnProperty('key') || !req.body.key || req.body.key == '') {
        return res.status(401).json({
            success: false,
            error: {
                message: 'You didn\'t provided token for authentication',
                fix: 'Provide your private token or obtain it at https://discord.gg/3WrP5BUfcw'
            }
        });
    }

    if (!file) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'No files uploaded',
                fix: 'Upload files'
            }
        });
    }

    if (file.size > 10 * 1000000) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Uploaded file too large',
                fix: 'Upload a file with less size (maximum 10MB)'
            }
        });
    }

    if (!allowedMIMETypes.includes(file.mimetype)) {
        return res.status(415).json({
            success: false,
            error: {
                message: 'Uploaded file too large',
                fix: 'Upload a file with less size (maximum 10MB)'
            }
        });
    }

    try {

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: {
                message: 'Unexpected error',
                fix: 'Bug has been reported to staff, please wait and try again'
            }
        });
    }
});

export default router;