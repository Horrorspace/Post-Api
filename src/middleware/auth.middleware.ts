import jwt from 'jsonwebtoken'
import {IConf} from 'interfaces/config'
import config from 'config/default.json'

config as IConf;

export default authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  
  try {
    
  }
  
  catch {
    res.status(401).json({ message: `You has not been auth` })
  }

}
