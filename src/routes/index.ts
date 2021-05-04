import * as express from 'express';
import * as functions from '../functions';

import api from './api';
import file from './file';
import accounts from './accounts';
import dashboard from './dashboard';

const config = functions.config();
const router = express.Router();

router.use('/api', api);
router.use('/', file);
router.use('/', accounts);
router.use('/dashboard', dashboard);

export default router;