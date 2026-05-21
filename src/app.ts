import express, { type Application, type Request, type Response } from 'express'
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { userRoute } from './modules/users/users.route';
import { issueRoute } from './modules/issues/issues.route';

const app: Application = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/auth', userRoute)
app.use('/api/issues', issueRoute)

app.use(globalErrorHandler)
export default app;