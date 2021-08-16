import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import {IConf} from './interfaces/config'
import config from './config/default.json'
import {router as postRouter} from '../src/routes/post.routes'

config as IConf;


const PORT: number = config.port || 4220;
const app = express();
const __dirname: string = path.dirname(__filename);
console.log(__dirname);
console.log(path.join(__dirname, 'build', 'client'));

app.use('/api/posts', postRouter);
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'client')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.all('*', (req, res) => {
    console.log(req.method)
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
});
