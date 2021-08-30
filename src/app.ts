import express from 'express'
import cors, { CorsOptions } from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import {IConf} from './interfaces/config'
import config from './config/default.json'
import {User} from './models/user'
import {router as postRouter} from '../src/routes/post.routes'
import {router as authRouter} from '../src/routes/auth.routes'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport, { use } from 'passport'
import MongoStore from 'connect-mongo'
import {localStrategy} from './auth/local'
import https from 'https'
import http from 'http'
import fs from 'fs'
import { IUser } from './interfaces/IUser'



config as IConf;

interface options {
  key: string | any;
  cert:  string | any;
}


const PORT: number = config.port || 3007;
const httpsPort: number = config.httpsPort || 443;
const httpPort: number = config.httpPort || 80;
const app = express();
const corsOptions: CorsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type',
   'X-Custom-Header',
   'x-requested-with',
   'Host',
   'User-Agent',
   'Accept',
   'Accept-Encoding',
   'Accept-Language',
   'Access-Control-Request-Headers',
   'Access-Control-Request-Method',
   'Proxy-Authorization',
   'Proxy-Connection',
   'Referer',
   'Sec-Fetch-Mode',
   'User-Agent',
   'Connection'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  credentials: true,
  preflightContinue: true
}
const __dirname: string = path.dirname(__filename);
// const options: options = {
//   key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
// }

app.use((req, res, next) => {
  console.log(req.method);
  next()
})

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({
  secret: "cats and dogs",
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
passport.serializeUser((exUser: Express.User, done) => {
  try {
    const user = exUser as IUser
    user.userId
    done(null, user.userId)
  }
  catch(err) {
    done(err)
  }
  
});
passport.deserializeUser((userId, done) => {
  User.findOne({userId}, (err, user) => {
    done(err, user)
  })
});

app.options('*', (req, res) => {
  console.log(req.hostname)
  console.log(res.getHeaders());
  console.log(req.headers);
  res.status(204).send();
})


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


app.use('/public/', express.static(path.join(__dirname, 'client', 'public')))

app.get('*', (req, res) => {
  //console.log(req.url);
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})





async function start() {
  try {
    await mongoose.connect(config.mongoUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      tlsCAFile: '/etc/ssl/certs/cacert.pem',
      tlsAllowInvalidHostnames: true
    });
    // https.createServer(options, app).listen(httpsPort, () => {
    //   console.log(`HTTPS server has been started on port ${httpsPort}...`);
    // });
    // http.createServer((req, res) => {
    //   console.log(req.url);
    //   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    //   res.end();
    // }).listen(httpPort, () => {
    //   console.log(`HTTP server has been started on port ${httpPort}...`);
    // });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start();
