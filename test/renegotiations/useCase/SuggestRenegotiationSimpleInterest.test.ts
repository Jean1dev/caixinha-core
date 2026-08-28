import { Member, Box, Loan, Renegotiation } from "../../../src"
import { getDataMais30Dias, getDataMenos30Dias, getDataMenosDias } from "../../testUtils"
import { SuggestRenegotiationSimpleInterest } from "../../../src/useCase"

describe('SuggestRenegotiationSimpleInterest test', () => {
    it('shoud be suggesty correctly', () => {
        const member = new Member('fake')
        const box = new Box()
        box.joinMember(member)
    
        const input = {
            approved: true,
            member,
            date: getDataMenos30Dias().toString(),
            totalValue: { value: 10 },
            valueRequested: { value: 10 },
            remainingAmount: { value: 10 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'fake',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [ getDataMenos30Dias().toString() ],
            uid: 'uid',
            listOfMembersWhoHaveAlreadyApproved: [ member],
            payments: []
        }
    
        const loan = Loan.fromBox(input)
        const reneg = Renegotiation.create(loan)

        const result = SuggestRenegotiationSimpleInterest(reneg)
        expect(result.id).not.toBeNull()
        expect(result.reason).not.toBeNull()
        expect(result.installmentOptions.length).toBe(5)
        expect(result.newInterestRate).toBeGreaterThan(0)
        expect(result.newTotalValue).toBeGreaterThan(10)
    })

    it('should suggest a renegotiation when an earlier installment is overdue', () => {
        const member = new Member('installment-member')
        const box = new Box()
        box.joinMember(member)

        const loan = Loan.fromBox({
            approved: true,
            member,
            date: getDataMenos30Dias().toString(),
            totalValue: { value: 100 },
            valueRequested: { value: 100 },
            remainingAmount: { value: 100 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'installment loan',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [getDataMenosDias(2).toString(), getDataMais30Dias().toString()],
            uid: 'installment-loan',
            listOfMembersWhoHaveAlreadyApproved: [member],
            payments: []
        })

        const result = SuggestRenegotiationSimpleInterest(Renegotiation.create(loan))

        expect(result.id).not.toBeNull()
        expect(result.newInterestRate).toBeGreaterThan(0)
        expect(result.newTotalValue).toBeGreaterThan(100)
    })
})
