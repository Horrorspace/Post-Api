import {Router} from 'express'
import {Posts} from '../models/posts'

export const router: Router = Router();

router.get('/', async (req, res) => {
    try {
      const posts = await Posts.find();
      console.log(posts);
      res.json(posts);
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

router.post('/', async (req, res) => {

})
