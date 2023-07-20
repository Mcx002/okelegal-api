export interface HealthDto {
    appName: string
    version: string
    uptime: Uptime
}

export interface Uptime {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
}
