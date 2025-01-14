import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import userRouter from './routes/user.js'
import quizRouter from './routes/quiz.js'
import tagRouter from './routes/tag.js'
import subjectRouter from './routes/subject.js'
import paperRouter from './routes/paper.js'
import subjectTopicHandler from './routes/subjectTopic.js'

// CONFIG
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'https://dashboard.ayufinders.com',  // The front-end origin
  credentials: true,  // Allow cookies to be sent with requests
}));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Or 'same-origin-allow-popups' if needed
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false }))


// ROUTES
app.use('/api/v1/user', userRouter)
app.use('/api/v1/quiz', quizRouter)
app.use('/api/v1/tag', tagRouter)
app.use('/api/v1/subject', subjectRouter)
app.use('/api/v1/paper', paperRouter)
app.use('/api/v1/subjectTopic', subjectTopicHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
  console.log(`Server listening on ${PORT}`)

  mongoose.connect(process.env.MONGODB_URL as string)
  
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));
})

export default app