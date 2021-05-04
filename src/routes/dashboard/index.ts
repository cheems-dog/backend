import * as express from 'express';
import * as passport from 'passport';
import * as functions from '../../functions';
import * as passportHelpers from '../../helpers/passport';
import { UserModel } from '../../models/user';

const config = functions.config();

const router = express.Router();

router.get('/', passportHelpers.ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    res.render('dashboard/index', {
        user: req.user
    });
});


export default router;