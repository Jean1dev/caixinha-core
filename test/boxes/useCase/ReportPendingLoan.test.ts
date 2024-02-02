import { Box } from "../../../src/boxes/Box"
import { Deposit } from "../../../src/deposits/Deposit"
import { Loan } from "../../../src/loans/Loan"
import { CreateLoanInput } from "../../../src/loans/loan.types"
import { Member } from "../../../src/members/Member"
import { ReportPendingLoan } from "../../../src/useCase"

describe('ReportPendingLoan', () => {
    it('Should be return empty report', () => {
        const report = ReportPendingLoan(new Box())
        expect(report).not.toBe(null)
        expect(report.length).toBe(0)
    })

    it('Should be return a correctly report', () => {
        const box = new Box()
        const member = new Member('juca')

        box.joinMember(member)
        box.deposit(new Deposit({
            member,
            value: 25
        }))

        let input: CreateLoanInput = {
            member,
            valueRequested: 25,
            interest: 5,
            box,
            description: 'teste',
            installments: 4
        }

        const loan = new Loan(input)
        loan.addApprove(member)

        let report = ReportPendingLoan(box)
        expect(report).not.toBe(null)
        expect(report.length).toBe(1)
        expect(report[0].loanUid).toStrictEqual([loan.UUID])
        expect(report[0].member.memberName).toBe(member.memberName)
        expect(report[0].valuePending.val).toBe(26.25)

        const member2 = new Member('carlos')
        box.joinMember(member2)
        box.deposit(new Deposit({
            member,
            value: 25
        }))

        input = {
            member: member2,
            valueRequested: 20,
            interest: 5,
            box,
            description: 'teste',
            installments: 0
        }

        const loan2 = new Loan(input)
        loan2.addApprove(member)
        loan2.addApprove(member2)

        report = ReportPendingLoan(box)
        expect(report).not.toBe(null)
        expect(report.length).toBe(2)

        const member2Case = report.find(i => i.member.memberName === member2.memberName)
        if (!member2Case) {
            expect(member2Case).not.toBe(null)
        }

        expect(member2Case?.loanUid).toStrictEqual([loan2.UUID])
        expect(member2Case?.valuePending.val).toBe(21)
    })

    it('Should be return a correctly report based on caixinha backup', async () => {
        const json = require('./input2.json')
        const box = Box.fromJson(json)
        const report = ReportPendingLoan(box)
        expect(report).not.toBe(null)
        expect(report.length).toBe(3)
        expect(report[0].valuePending.val).toBe(805.8)
        expect(report[1].valuePending.val).toBe(357)
        expect(report[2].valuePending.val).toBe(663)
    })
})