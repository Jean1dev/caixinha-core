import { Member, Box, Loan, Renegotiation } from "../../../src"
import { getDataMenos30Dias } from "../../testUtils"
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
        expect(result.newInterestRate).toBeGreaterThan(5)
        expect(result.newTotalValue).toBeGreaterThan(10)
    })
})
