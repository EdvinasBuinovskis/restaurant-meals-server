import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utilities.js';
import { isAdmin, isAuth } from '../utilities.js';

const userRouter = express.Router();

userRouter.post('/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user.id,
                    username: user.username,
                    isAdmin: user.isAdmin,
                    token: generateToken(user)
                });
                return;
            }
        }
        res.status(401).send({ message: "Invalid username or password" });
    })
);

userRouter.post('/register',
    expressAsyncHandler(async (req, res) => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });
        const createdUser = await user.save();
        if (createdUser) {
            res.send({
                _id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                token: generateToken(createdUser)
            });
        } else {
            res.status(500).send({ message: 'Failed to Register' });
        }
    })
);

userRouter.get('/:id', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

export default userRouter;