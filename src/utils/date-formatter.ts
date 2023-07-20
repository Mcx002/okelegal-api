import { Uptime } from '../dto/health.dto'
import { DateTime } from 'luxon'

export const convertSecondsToUptime = (seconds: number): Uptime => {
    const secondsInYear = 31536000 // 60 seconds * 60 minutes * 24 hours * 365 days
    const secondsInMonth = 2592000 // 60 seconds * 60 minutes * 24 hours * 30 days
    const secondsInDay = 86400 // 60 seconds * 60 minutes * 24 hours
    const secondsInHour = 3600 // 60 seconds * 60 minutes
    const secondsInMinute = 60

    const years = Math.floor(seconds / secondsInYear)
    seconds %= secondsInYear

    const months = Math.floor(seconds / secondsInMonth)
    seconds %= secondsInMonth

    const days = Math.floor(seconds / secondsInDay)
    seconds %= secondsInDay

    const hours = Math.floor(seconds / secondsInHour)
    seconds %= secondsInHour

    const minutes = Math.floor(seconds / secondsInMinute)
    seconds %= secondsInMinute

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
    }
}

export const dateToUnix = (date: Date): number => {
    return DateTime.fromJSDate(date).toSeconds()
}
