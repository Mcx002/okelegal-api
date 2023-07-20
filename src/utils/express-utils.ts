import Express from 'express'

export const captureClientIP = (req: Express.Request): string => {
    let ip = req.header('x-forwarded-for')

    if (!ip) {
        ip = req.socket.remoteAddress
    }

    return ip || ''
}
