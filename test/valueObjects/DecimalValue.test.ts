import { DecimalValue } from '../../src/valueObjects/DecimalValue'

describe('DecimalValue class test', () => {
    it('should be create correctly', () => {
        const n = 25.894
        const value = DecimalValue.from(n)
        expect(n).toBe(value.val)

        let newVal = DecimalValue.from({ value: 3 })
        expect(3).toBe(newVal.val)

        newVal = DecimalValue.from(25.98)
        expect(25.98).toBe(newVal.val)

        newVal = DecimalValue.from(value)
        expect(value.val).toBe(newVal.val)
    })

    it('should be throw exception', () => {
        expect(() => DecimalValue.from(null as unknown as number))
            .toThrow('Value cannot be null or undefined')
    })
})