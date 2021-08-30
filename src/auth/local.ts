import { User } from '../models/user'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import bcrypt from 'bcryptjs'
import { IUser } from '../interfaces/IUser'


export const localStrategy = new LocalStrategy(
   {
    usernameField: 'email'
   },
   async (username, password, done): Promise<void> => {
        try {
            console.log(username, password);
            const user: any = await User.findOne({email: username});
            console.log(user);
            console.log(!user);
            if(!user) {
                return done(null, false, {message: 'Incorrect email'})
            }
            
            const isMatch: boolean = await bcrypt.compare(password, user.password);
            console.log(isMatch);

            if(!isMatch) {
                return done(null, false, { message: 'Incorrect password.' })
            }
            else {
                return done(null, user)
            }
        }
        catch(err) {
            return done(err)
        }
    })