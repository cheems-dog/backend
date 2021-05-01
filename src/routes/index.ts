import * as express from 'express';
import * as functions from '../functions';

import api from './api';
import file from './file';
import accounts from './accounts';

const config = functions.config();
const router = express.Router();

router.use('/api', api);
router.use('/', file);
router.use('/', accounts);

export default router;