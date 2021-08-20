import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import {IConf} from './interfaces/config'
import config from './config/default.json'
import {router as postRouter} from '../src/routes/post.routes'
import {MongoClient} from 'mongodb'

import {IPostData, IPost} from 'interfaces/IPosts'
import {Schema, model} from 'mongoose'

config as IConf;


const PORT: number = config.port || 4220;
const app = express();
const __dirname: string = path.dirname(__filename);
console.log(__dirname);
console.log(path.join(__dirname, 'build', 'client'));

app.use('/api/posts', postRouter);
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'client', 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.all('*', (req, res) => {
    console.log(req.method)
})

// console.log(config.mongoUri);
// const mongoClient = new MongoClient(config.mongoUri, {
//   tlsCAFile: '/etc/ssl/certs/cacert.pem',
//   tlsAllowInvalidHostnames: true
// });

//mongoClient.connect().then(val => console.log(val.options.dbName));

async function start() {
  try {
    await mongoose.connect(config.mongoUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      tlsCAFile: '/etc/ssl/certs/cacert.pem',
      tlsAllowInvalidHostnames: true
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`)
    });
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start();