import * as express from 'express';

import upload from './upload';
import thumbnail from './thumbnail';
import users from './users';
import stats from './stats';

const router = express.Router();

router.use('/upload', upload);
router.use('/thumbnail', thumbnail);
router.use('/users', users);
router.use('/stats', stats);

export default router;