import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const loginValidationMiddleware = [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("You must supply a password")
]

const router = express.Router();

router.post('/api/users/signin', loginValidationMiddleware, validateRequest, async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    await Password.compare(password, existingUser.password)
        .then(() => {

            // Generate JWT
            const userJwt = jwt.sign(
                {
                    id: existingUser.id,
                    email: existingUser.email
                },
                process.env.JWT_KEY!
            );

            // Store it on session Object
            req.session = {
                jwt: userJwt
            };

            res.status(200).send(existingUser);
        })
        .catch(err => {
            throw new BadRequestError('Invalid Credentials');
        });

});

export { router as signinRouter };