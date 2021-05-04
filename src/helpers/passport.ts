import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as passportLocal from 'passport-local';
import { UserModel } from '../models/user';

export const configure = (passport) => {
    passport.use(
        new passportLocal.Strategy(async (username, password, done) => {
            const user = await UserModel.findOne({ username: username });

            if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'That email is not registered' });
            if (!user.active) return done(null, false, { message: 'This account wasn\'t activated yet, please check your mail' });

            return done(null, user);
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

export const ensureAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) return next();
    
    res.redirect(`/login?redirect=${encodeURI(req.originalUrl)}`);
}

export const forwardAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.isAuthenticated()) return next();

    res.redirect('/dashboard');
}