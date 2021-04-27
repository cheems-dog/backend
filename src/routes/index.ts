import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as functions from '../functions';

import file from './file';
import api from './api';

const config = functions.config();
const router = express.Router();

router.use('/api', api);
router.use('/', file);

export default router;