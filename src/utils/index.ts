import crypto from 'crypto'

export function generateUUID() {
    const uuid = crypto.randomBytes(16);
    uuid[6] = (uuid[6] & 0x0f) | 0x40;  // versão 4
    uuid[8] = (uuid[8] & 0x3f) | 0x80;  // variant RFC 4122
    return uuid.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/).slice(1).join('-');
}

export function stringToDate(value: string | Date | undefined): Date {
  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'string') {
    return new Date(value)
  }

  return new Date(0)
}

export function getDifferenceBetweenDates(date1, date2, unit = 'days') {
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

    if (unit === 'days') {
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return diffInDays;
    } else if (unit === 'hours') {
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        return diffInHours;
    } else if (unit === 'minutes') {
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        return diffInMinutes;
    } else if (unit === 'seconds') {
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        return diffInSeconds;
    } else {
        return null; // Unrecognized unit
    }
}