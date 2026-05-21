import { config } from './config'
import app from './app';
import { initDB } from './db';

const main = async () => {
    await initDB();

    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`)
    })
}

main()