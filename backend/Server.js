import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routers/userRouter.js'
import paperRouter from './routers/paperRouter.js'
import shapeRouter from './routers/shapeRouter.js'
import connectDB  from './Config/DbConfig.js'
import { notFound, errorHandler } from './middleware/errorHandlingMiddleware.js'
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
connectDB()
app.use('/api/user', userRouter)
app.use('/api/paper', paperRouter)
app.use('/api/shapes', shapeRouter)


app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`SERVER STARTED ON PORT ${process.env.PORT}`);
})

