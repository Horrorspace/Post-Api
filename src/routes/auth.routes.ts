import {IUser} from 'interfaces/IUser'
import {Router} from 'express'
import {User} from '../models/user'
import {check, validationResult} from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/default.json'
import {IConf} from 'interfaces/config'

config as IConf;


export const router: Router = Router();

router.post(
    '/register',
    [
        check('email', 'Invalid email')
            .isEmail(),
        check('password', 'Invalid password')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const userData: IUser = req.body;
            const {email, password} = userData;

            const existingEmail = await User.findOne({email});

            if(existingEmail) {
                return res.status(400).json({
                    message: 'This email already has been used'
                })
            }

            const users = await User.find();
            let newId: number;
            if(users.length > 0) {
                const idList: number[] = users.map(val => val.userId);
                const maxId: number = idList.reduce((acc, val) => acc > val ? acc : val);
                newId = maxId + 1;
    
            }
            else {
                newId = 1
            }

            const hashedPass: string = await bcrypt.hash(password, 15);
            const user = new User({email, password: hashedPass, userId: newId});

            await user.save();

            res.status(201).json({
                message: `User with email: ${email} has been added`
            })
        }
        catch {
            res.status(500).json({
                message: 'Something wrong, try again'
            })
        }
    }
)


router.post(
    '/login',
    [
        check('email', 'Invalid email')
            .isEmail(),
        check('password', 'Empty password')
            .exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const userData: IUser = req.body;
            const {email, password} = userData;

            const user = await User.findOne({email});

            if(!user) {
                return res.status(400).json({
                    message: `User doesn't exist`
                })
            }

            const isMatch: boolean = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).json({
                    message: 'Invalid password'
                })
            }
            
            const token = jwt.sign(
                { userId: user.userId },
                config.jwtSecret,
                { expiresIn: '1h' }
            )


            res.status(201).json({
                token, 
                userId: user.userId
            })
        }
        catch {
            res.status(500).json({
                message: 'Something wrong, try again'
            })
        }
    }
)

