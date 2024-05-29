import { Box, Loan, Member, Renegotiation } from "../../../src"
import { AcceptRenegotiation } from "../../../src/useCase"
import { getDataMenos30Dias } from "../../testUtils"

function validLoanForRenegotiation() {
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

    return {
        loan,
        box,
        member
    }
}

describe('AcceptRenegotiation Test', () => {
    it('cannot continue because member has not owner this loan', () => {
        const { loan, box } = validLoanForRenegotiation()
        const fraudster = new Member('fraudster')

        const renege = Renegotiation.create(loan)
        expect(() => AcceptRenegotiation(
            box,
            renege,
            fraudster,
            {
                installmentOptions: 3,
                newTotalValue: 15
            }
        )).toThrow('You are not the owner of this loan')
    })

    it('cannot continue because have invalid input', () => {
        const { loan, box } = validLoanForRenegotiation()
        const fraudster = new Member('fraudster')

        const renege = Renegotiation.create(loan)
        expect(() => AcceptRenegotiation(
            box,
            renege,
            fraudster,
            {
                installmentOptions: 0,
                newTotalValue: 0
            }
        )).toThrow('Invalid input')
    })

    it('should accept and conclud all proccess', () => {
        const { loan, box, member } = validLoanForRenegotiation()
        box['loans'] = [loan]
        const renege = Renegotiation.create(loan)
        const { newLoan, reneg: proposal } = AcceptRenegotiation(
            box,
            renege,
            member,
            {
                installmentOptions: 3,
                newTotalValue: 15
            }
        )

        expect(box._loans.length).toBe(1)
        expect(proposal['status']).toBe('FINISHED')

        expect(newLoan['installments']).toBe(3)
        expect(newLoan._totalValue).toBe(15)
    })
})