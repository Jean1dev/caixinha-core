import CalculateInstallmentsValue from '../../../src/loans/useCase/CalculateInstallmentsValue'
import { DecimalValue } from '../../../src/valueObjects/DecimalValue'

describe('CalculateInstallmentsValue test', () => {
    it('shoud be calculate correctly', () => {
        let res = CalculateInstallmentsValue(DecimalValue.from(500), 5)

        expect(res).toHaveLength(5)
        expect(res[0].value).toBe(100)
        expect(res[1].value).toBe(100)
        expect(res[2].value).toBe(100)
        expect(res[3].value).toBe(100)

        res = CalculateInstallmentsValue(525.88, 3)
        expect(res).toHaveLength(3)

        expect(res[0].value).toBe(175.29)
        expect(res[1].value).toBe(175.29)
        expect(res[2].value).toBe(175.29)

        expect(() => CalculateInstallmentsValue(525.88, -1)).toThrow('parameter numberOfInstallments cannot be lower equal than 1')
    })
})