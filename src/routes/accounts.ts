import * as express from 'express';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as functions from '../functions';
import * as passportHelpers from '../helpers/passport';
import { UserModel } from '../models/user';
import { VerificationModel } from '../models/verification';

const config = functions.config();

const router = express.Router();

const createId = (length = 6) => {
    const characters = [
        'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E',
        'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i',
        'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N',
        'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r',
        'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W',
        'w', 'X', 'x', 'Y', 'y', 'Z', 'z', '1', '2',
        '3', '4', '5', '6', '7', '8', '9', '0', '-',
        '_'
    ];
    let string = '';

    for (let i = 0; i < length; i++) string += characters[Math.floor(Math.random() * characters.length)];

    return string;
}

router.get('/register', async (req: express.Request, res: express.Response) => {
    res.render('register');
});

router.post('/register', async (req: express.Request, res: express.Response) => {
    if (req.body.password !== req.body.password2) {
        return res.render('register', {
            info: {
                type: 'error',
                content: 'Passwords do not match'
            }
        });
    }
    if (await UserModel.findOne({ username: req.body.username }).exec() !== null) {
        return res.render('register', {
            info: {
                type: 'error',
                content: 'This username is already taken'
            }
        });
    }
    if (await UserModel.findOne({ email: req.body.email }).exec() !== null) {
        return res.render('register', {
            info: {
                type: 'error',
                content: 'There is an account registered for that email already'
            }
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: config.mail.smtp.host,
            port: config.mail.smtp.port,
            secure: config.mail.smtp.secure,
            auth: {
                user: config.mail.mailer.username,
                pass: config.mail.mailer.password
            },
            ignoreTLS: true,
        });

        const mailOptions = {
            from: config.mail.mailer.from,
            to: req.body.email,
            subject: config.mail.mails.register.subject
        };

        const verificationId = createId(64);

        if (config.mail.mails.register.html) (mailOptions as any).html = config.mail.mails.register.body.replaceAll('{verificationUrl}', `${config.hostname}/verify_account/${verificationId}`);
        else (mailOptions as any).text = config.mail.mails.register.body.replaceAll('{verificationUrl}', `${config.hostname}/verify_account/${verificationId}`);


        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                res.render('register', {
                    info: {
                        type: 'error',
                        content: 'Error when sending email'
                    }
                });
                return console.log(error);
            }

            console.log('Message sent: %s', info);

            const user = await UserModel.create({
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, await bcrypt.genSalt()),
                email: req.body.email,
                token: crypto.randomBytes(32).toString('base64'),
                uploadedFiles: 0,
                active: false
            });

            await VerificationModel.create({
                verificationId: verificationId,
                type: 'create_account_verification',
                owner: user._id
            });

            res.render('register', {
                info: {
                    type: 'success',
                    content: 'Confirmation email was sent!'
                }
            });
        });


    } catch (err) { }
});

router.get('/login', passportHelpers.forwardAuthenticated, async (req: express.Request, res: express.Response) => {
    res.render('login');
});

router.post('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // const user = await UserModel.findOne({ username: req.body.username });

    // if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
    //     return res.render('login', {
    //         info: {
    //             type: 'error',
    //             content: 'Incorrect username/password'
    //         }
    //     });
    // }

    // if(!user.active) {
    //     return res.render('login', {
    //         info: {
    //             type: 'error',
    //             content: 'This account wasn\'t activated yet, please check your mail'
    //         }
    //     });
    // }

    // res.status(200).redirect('/dashboard');

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })(req, res, next);
});

router.get('/verify_account/:verificationId', async (req: express.Request, res: express.Response) => {
    const verification = await VerificationModel.findOne({ verificationId: req.params.verificationId }).exec();

    if (verification === null) {
        return res.status(404).render('verify_account', {
            status: 404
        });
    }

    try {
        await UserModel.findByIdAndUpdate(verification.owner, {
            active: true
        }).exec();
        await VerificationModel.findByIdAndDelete(verification._id).exec();

        res.render('verify_account', {
            status: 200
        });
    } catch (err) {
        res.status(500).render('verify_account', {
            status: 500,
            err
        });
    }
});

router.get('/logout', (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/?message=logged_out')
})

export default router;