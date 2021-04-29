import * as express from 'express';
import * as mongoose from 'mongoose';
import * as rateLimit from 'express-rate-limit';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { UserModel, User } from '../../models/user';

const router = express.Router();

interface CreateUser {
    username: string;
    email: string;
    password: string;
}

/**
 * @description Checks if provided object follows CreateUser interface
 * @param input Object to verify
 * @returns {boolean} Is provided object valid with CreateUser interface
 * @author JuzioMiecio520
 */

const isCreateUser = (input: any): input is CreateUser => {
    const schema: Record<keyof CreateUser, string> = {
        username: 'string',
        email: 'string',
        password: 'string'
    };

    const missingProperties = Object.keys(schema)
        .filter(key => input[key] === undefined)
        .map(key => key as keyof CreateUser)
        .map(key => new Error(`Document is missing ${key} ${schema[key]}`));

    return missingProperties.length === 0;
}

// * Getting user info by ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            error: {
                code: 400,
                title: 'Bad request',
                message: 'Provided ID is not a valid ID'
            }
        });
    }

    const user = await UserModel.findById(req.params.id).exec();

    if (user === null) {
        return res.status(404).json({
            error: {
                code: 404,
                title: 'Not found',
                message: 'This user was not found, check the ID'
            }
        });
    }

    // ? Change database structure to not remove sensitive data on requests
    delete user['token'];
    res.status(200).json(user);
});

// * Get user avatar by ID
router.get('/:id/avatar', async (req: express.Request, res: express.Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            error: {
                code: 400,
                title: 'Bad request',
                message: 'Provided ID is not a valid ID'
            }
        });
    }

    const user = await UserModel.findById(req.params.id).exec();

    if (user === null) {
        return res.status(404).json({
            error: {
                code: 404,
                title: 'Not found',
                message: 'This user was not found, check the ID'
            }
        });
    }

    if(!fs.existsSync(path.join(__dirname, '../../storage/avatars/', user._id.toString(), '.png'))) return res.sendFile(path.join(__dirname, '../../static/images/unknown_user.png'));

    res.sendFile(path.join(__dirname, '../../storage/avatars/', user._id.toString(), '.png'));
});

// * Updating user by ID, authentication thru header "Authorization"
router.patch('/:id', async (req: express.Request, res: express.Response) => {
    if (!req.header('Authorization')) {
        return res.status(401).json({
            error: {
                code: 401,
                title: 'Unauthorized',
                message: 'You did not provide authentication token'
            }
        });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            error: {
                code: 400,
                title: 'Bad request',
                message: 'Provided ID is not a valid ID'
            }
        });
    }

    const user = await UserModel.findById(req.params.id).exec();

    if (user === null) {
        return res.status(404).json({
            error: {
                code: 404,
                title: 'Not found',
                message: 'This user was not found, check the ID'
            }
        });
    }

    if (user.token !== req.header('Authorization')) {
        return res.status(403).json({
            error: {
                code: 403,
                title: 'Forbidden',
                message: 'Provided token cannot update this user'
            }
        });
    }

    try {
        const updated = await UserModel.updateOne({ _id: user._id }, { $set: req.body }).exec();

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: {
                code: 500,
                title: 'Internal server error',
                message: 'There was unexpected error. Please report the following \'debug\' field to https://github.com/cheems-dog/backend/issues',
                debug: err
            }
        });
    }
});

// * Creating user with ratelimit of 1 request per 15 minutes
router.post('/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1,
    message: {
        error: {
            code: 429,
            title: 'Too many requests',
            message: 'There was too many requests in the past 15 minutes'
        }
    }
} as any), async (req: express.Request, res: express.Response) => {
    if (!isCreateUser(req.body)) {
        return res.status(400).json({
            error: {
                code: 400,
                title: 'Bad request',
                message: 'Provided body was missing correct properties'
            }
        });
    }

    const obj = req.body as any;

    obj.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt());
    obj.token = crypto.randomBytes(32).toString('base64');

    UserModel.create(obj).then(() => {
        delete obj['password'];
        res.status(200).json(obj);
    }).catch((err) => {
        res.status(500).json({
            error: {
                code: 500,
                title: 'Internal server error',
                message: 'There was unexpected error. Please report the following \'debug\' field to https://github.com/cheems-dog/backend/issues',
                debug: err
            }
        });
    });
});

export default router;