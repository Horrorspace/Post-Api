import jwt from 'jsonwebtoken'
import {IConf} from '../interfaces/config'
import config from '../config/default.json'

config as IConf;

export const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  
  try {
    const token = req.headers.authorization.split(' ')[1];
 
    if(!token) {
      return res.status(401).json({ message: `You has not been auth` })
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next()
  }
  
  catch {
    res.status(401).json({ message: `You has not been auth` })
  }

}
