import { Box } from '../../../src/boxes/Box'
import { CalculateAssetDevlopment } from '../../../src/useCase'

const _ = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
}

describe('CalculateAssetDevlopment test', () => {
    it('shoud be calculate correcty', () => {
        const json = require('./inputs.json')

        let box = Box.fromJson(json[0])
        let result = CalculateAssetDevlopment(box, _.January)
        expect(result.availableBalance.data).toHaveLength(12)
        expect(result.portfolioBalance.data).toHaveLength(12)

        expect(result.availableBalance.data[_.January]).toBe(0)
        expect(result.portfolioBalance.data[_.January]).toBe(0)

        expect(result.availableBalance.data[_.February]).toBe(0)
        expect(result.portfolioBalance.data[_.February]).toBe(0)


        box = Box.fromJson(json[1])
        result = CalculateAssetDevlopment(box, _.June)

        expect(result.availableBalance.data[_.January]).toBe(0)
        expect(result.portfolioBalance.data[_.January]).toBe(0)

        expect(result.availableBalance.data[_.February]).toBe(0)
        expect(result.portfolioBalance.data[_.February]).toBe(0)

        expect(result.availableBalance.data[_.March]).toBe(50)
        expect(result.portfolioBalance.data[_.March]).toBe(50)

        expect(result.availableBalance.data[_.April]).toBe(100)
        expect(result.portfolioBalance.data[_.April]).toBe(100)

        expect(result.availableBalance.data[_.May]).toBe(100)
        expect(result.portfolioBalance.data[_.May]).toBe(100)

        expect(result.availableBalance.data[_.June]).toBe(0)
        expect(result.portfolioBalance.data[_.June]).toBe(0)
        
        box = Box.fromJson(json[2])
        result = CalculateAssetDevlopment(box, _.May)

        expect(result.availableBalance.data[_.January]).toBe(0)
        expect(result.portfolioBalance.data[_.January]).toBe(0)

        expect(result.availableBalance.data[_.February]).toBe(0)
        expect(result.portfolioBalance.data[_.February]).toBe(0)

        expect(result.availableBalance.data[_.March]).toBe(50)
        expect(result.portfolioBalance.data[_.March]).toBe(50)

        expect(result.availableBalance.data[_.April]).toBe(125.5)
        expect(result.portfolioBalance.data[_.April]).toBe(125.5)

        expect(result.availableBalance.data[_.May]).toBe(0)
        expect(result.portfolioBalance.data[_.May]).toBe(0)
    })
})

