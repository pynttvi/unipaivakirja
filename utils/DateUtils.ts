import {format, parse} from "date-fns";

export function dateToString(date: Date) {
    return format(date, 'dd.MM.yyyy')
}

export function stringToDate(date: string) {
    return parse(date, 'dd.MM.yyyy', new Date());
}

export const timeToMinutes = (t: Time) => t.hour * 60 + t.minute;