import { DecimalValue } from '../../src/valueObjects/DecimalValue'

describe('DecimalValue class test', () => {
    it('should be create correctly' , () => {
        const n = 25.894
        const value = new DecimalValue(n)
        expect(n).toBe(value.val)
    })

    it('should be throw exception', () => {
        try {
            new DecimalValue(null as unknown as number)
        } catch (ex) {
            expect('Value cannot be null or undefined').toBe(ex.message)
        }
    })
})