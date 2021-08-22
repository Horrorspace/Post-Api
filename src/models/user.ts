import {IUser} from 'interfaces/IUser'
import {Schema, model, Model} from 'mongoose'


export const userScheme: Schema<IUser> = new Schema({
    email: {type: Schema.Types.String, required: true},
    userId: {type: Schema.Types.Number, required: true, unique: true},
    password: {type: Schema.Types.String, required: true},
});

export const User: Model<IUser> = model('user', userScheme);