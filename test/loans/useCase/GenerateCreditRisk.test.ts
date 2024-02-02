import { Box } from "../../../src/boxes/Box"
import { GenerateCreditRisk } from "../../../src/useCase"

describe('GenerateCreditRisk', () => {
    it('Should be generate correctly analyses', () => {
        const json = require('../../boxes/useCase/input2.json')
        const box = Box.fromJson(json)
        GenerateCreditRisk(box._loans, box['members'])
    })
})