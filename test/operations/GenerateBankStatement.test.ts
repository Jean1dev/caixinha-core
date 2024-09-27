import { GenerateBankStatement } from '../../src/operations'
import { Box, Member } from '../../src/index'
import { writeOut } from '../testUtils';

describe('Generate Bank Statement', () => {
    it('should generate a bank statement', () => {
        const boxJson = require('../boxes/box.json')
        const box = Box.fromJson(boxJson)
        const member = Member.build({
            "name": "jean",
            "email": "jean_fp@jean"
        })
        const result = GenerateBankStatement(member, [box])
        writeOut(result)

        expect(result.length).toBe(1)

        const oneResult = result[0]

        expect(oneResult.member._email).toBe(member._email)
        expect(oneResult.member.memberName).toBe(member.memberName)

        expect(oneResult.deposits[0].value).toBe(25)
        expect(oneResult.totalDeposits).toBe(25)

        expect(oneResult.totalLoans).toBe(0)
        expect(oneResult.loans.length).toBe(0)
    });
})