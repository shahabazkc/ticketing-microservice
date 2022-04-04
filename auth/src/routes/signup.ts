import express, { Request, Response } from 'express';
import { body } from "express-validator";
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';
const router = express.Router();

router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage("Email must be valid"),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        let { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        password = await Password.toHash(password);

        const user = User.build({
            email, password
        });

        await user.save();

        // Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_KEY!
        );

        // Store it on session Object
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);

    });

export { router as signupRouter };