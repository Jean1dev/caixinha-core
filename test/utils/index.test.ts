import { getDifferenceBetweenDates, stringToDate } from "../../src/utils"

describe('utils/index', () => {
    it('stringToDate should return same Date when input is Date', () => {
        const d = new Date('2024-01-01T00:00:00Z')
        expect(stringToDate(d)).toBe(d)
    })

    it('stringToDate should parse string to Date', () => {
        const d = stringToDate('2024-01-01T00:00:00Z')
        expect(d instanceof Date).toBe(true)
        expect(d.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    })

    it('stringToDate should return now when input is undefined', () => {
        const before = Date.now()
        const d = stringToDate(undefined)
        const after = Date.now()
        expect(d.getTime()).toBeGreaterThanOrEqual(before - 5_000)
        expect(d.getTime()).toBeLessThanOrEqual(after + 5_000)
    })

    it('getDifferenceBetweenDates should compute days', () => {
        const d1 = new Date('2024-01-01T00:00:00Z')
        const d2 = new Date('2024-01-11T00:00:00Z')
        expect(getDifferenceBetweenDates(d1, d2, 'days')).toBe(10)
    })

    it('getDifferenceBetweenDates should compute hours', () => {
        const d1 = new Date('2024-01-01T00:00:00Z')
        const d2 = new Date('2024-01-01T10:30:00Z')
        expect(getDifferenceBetweenDates(d1, d2, 'hours')).toBe(10)
    })

    it('getDifferenceBetweenDates should compute minutes', () => {
        const d1 = new Date('2024-01-01T00:00:00Z')
        const d2 = new Date('2024-01-01T00:10:30Z')
        expect(getDifferenceBetweenDates(d1, d2, 'minutes')).toBe(10)
    })

    it('getDifferenceBetweenDates should compute seconds', () => {
        const d1 = new Date('2024-01-01T00:00:00Z')
        const d2 = new Date('2024-01-01T00:00:10Z')
        expect(getDifferenceBetweenDates(d1, d2, 'seconds')).toBe(10)
    })

    it('getDifferenceBetweenDates should return null for invalid unit', () => {
        const d1 = new Date('2024-01-01T00:00:00Z')
        const d2 = new Date('2024-01-01T00:00:10Z')
        expect(getDifferenceBetweenDates(d1, d2, 'invalid')).toBeNull()
    })
})
