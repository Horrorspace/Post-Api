import {INewPost, IPostData, IPostId} from '../interfaces/IPosts'
import {Router} from 'express'
import {Post} from '../models/posts'

export const router: Router = Router();

router.get('/', async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

router.post('/', async (req, res) => {
  try {
    const newPostData = req.body as INewPost;
    const posts = await Post.find();
    const idList: number[] = posts.map(val => val.id);
    const maxId: number = idList.reduce((acc, val) => acc > val ? acc : val);
    const newId: number = maxId + 1;
    const newPost: IPostData = {...newPostData, id: newId};
    const post = new Post(newPost);
    await post.save();
    res.status(201).json({post});
  }
  catch(e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.delete('/*', async (req, res) => {
  try {
    const regEx: RegExp = /^\//;
    const urlId: number = parseInt(req.url.replace(regEx, ''), 10);
    const id = req.body as IPostId;
    if(urlId === id.id) {
      await Post.deleteOne(id);
      res.status(201).json(`Post with id: ${id.id} has been deleted`);
    }
    else {
      throw 'id in url and in body is not equal'
    }
  }
  catch(e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.put('/*', async (req, res) => {
  try {
    const regEx: RegExp = /^\//;
    const urlId: number = parseInt(req.url.replace(regEx, ''), 10);
    const postToPut = req.body as IPostData;
    if(urlId === postToPut.id) {
      await Post.updateOne({id: postToPut.id}, {title: postToPut.title, body: postToPut.body});
      res.status(201).json(postToPut);
    }
    else {
      throw 'id in url and in body is not equal'
    }
  }
  catch(e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})
