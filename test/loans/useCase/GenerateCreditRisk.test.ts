import { Box } from "../../../src/boxes/Box"
import { GenerateCreditRisk } from "../../../src/useCase"

describe('GenerateCreditRisk', () => {
    it('Should be generate correctly analyses', () => {
        const json = require('../../boxes/useCase/input2.json')
        const box = Box.fromJson(json)
        const result = GenerateCreditRisk(box._loans, box._members)
        expect(result.length).toBe(5)
        
    })
})