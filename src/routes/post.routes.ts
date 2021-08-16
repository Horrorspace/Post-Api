import {Router} from 'express'
import {posts} from '../models/posts'

export const router: Router = Router();

router.get('/', async (req, res) => {
    try {
      console.log(req);
      res.json(posts);
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
