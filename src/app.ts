import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import {IConf} from './interfaces/config'
import config from './config/default.json'
import {router as postRouter} from '../src/routes/post.routes'
import {router as authRouter} from '../src/routes/auth.routes'
import bodyParser from 'body-parser'
import https from 'https'
import http from 'http'
import fs from 'fs'



config as IConf;

interface options {
  key: string | any;
  cert:  string | any;
}


const PORT: number = config.port || 3007;
const httpsPort: number = config.httpsPort || 443;
const httpPort: number = config.httpPort || 80;
const app = express();
const __dirname: string = path.dirname(__filename);
const options: options = {
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use(cors());

app.use('/public/', express.static(path.join(__dirname, 'client', 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.all('*', (req, res) => {
    console.log(req.method)
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
