import { PerformanceValue } from "../../src/valueObjects/PerformanceValue"

describe('PerformanceValue test', () => {
    it('shoud be apply all validations', () => {
        expect(() => {
            PerformanceValue.fromJson({
                monthNumber: -1,
                value: { value: 2 },
                yearNumber: 2020
            })
        }).toThrowError('monthNumber must be a number into range 1~12, yearNumber cannot be last than 2023')

        expect(() => {
            PerformanceValue.fromJson({
                monthNumber: 13,
                value: { value: 2 },
                yearNumber: 2023
            })
        }).toThrowError('monthNumber must be a number into range 1~12')
    })
})