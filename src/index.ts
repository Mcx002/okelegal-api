import { boot } from './boot'

async function main() {
    const { app, port, logger } = await boot()

    app.listen(port, () => logger.info(`Running on Port: ${port}`))
}

main().catch((e) => console.error(e))
