import {IPostData, IPost} from 'interfaces/IPosts'
import {Schema, model, Model} from 'mongoose'


export const postScheme: Schema<IPostData> = new Schema({
  userId: {type: Schema.Types.Number, required: true},
  id: {type: Schema.Types.Number, required: true, unique: true},
  title: {type: Schema.Types.String, required: true},
  body: {type: Schema.Types.String, required: true},
});

export const Post: Model<IPostData> = model('posts', postScheme);