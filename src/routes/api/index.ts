import * as express from 'express';

import upload from './upload';
import thumbnail from './thumbnail';

const router = express.Router();

router.use('/upload', upload);
router.use('/thumbnail', thumbnail);

export default router;