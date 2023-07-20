export abstract class MError extends Error {
    status: number
    message: string
    data: unknown
    protected constructor(status: number, message: string, data: unknown) {
        super(message)

        this.status = status
        this.message = message
        this.data = data ?? null
    }

    abstract setStatus(status: number): MError
}

export class ClientError extends MError {
    code: string
    constructor(message: string, data?: unknown) {
        super(400, message, data)

        this.code = 'N/A'
    }

    setCode(code: string): ClientError {
        if (code !== '') {
            this.code = code
        }

        return this
    }

    setStatus(clientErrorStatusCode: number): ClientError {
        this.status = clientErrorStatusCode

        return this
    }

    setMessage(message: string): ClientError {
        this.message = message

        return this
    }
}

export class ServerError extends MError {
    constructor(message: string, data?: unknown) {
        super(500, message, data)
    }

    setStatus(serverErrorStatusCode: number): ServerError {
        this.status = serverErrorStatusCode

        return this
    }

    setMessage(message: string): ServerError {
        this.message = message

        return this
    }
}
