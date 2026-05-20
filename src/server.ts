import { config } from './config'
import app from './app';

app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}`)
})