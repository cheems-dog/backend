import * as express from 'express';

import upload from './upload';
import thumbnail from './thumbnail';
import users from './users';

const router = express.Router();

router.use('/upload', upload);
router.use('/thumbnail', thumbnail);
router.use('/users', users);

export default router;