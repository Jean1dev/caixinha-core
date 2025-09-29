import { Member, Box, Loan, Renegotiation } from "../../../src"
import { getDataMenos30Dias } from "../../testUtils"
import SuggestManualRenegotiation from "../../../src/renegotiations/useCase/SuggestManualRenegotiation"

describe('SuggestManualRenegotiation test', () => {
    it('should suggest manual renegotiation correctly with 5% interest rate', () => {
        const member = new Member('fake')
        const box = new Box()
        box.joinMember(member)
    
        const input = {
            approved: true,
            member,
            date: getDataMenos30Dias().toString(),
            totalValue: { value: 100 },
            valueRequested: { value: 100 },
            remainingAmount: { value: 100 },
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

        const result = SuggestManualRenegotiation(reneg, 5)
        
        expect(result.id).not.toBeNull()
        expect(result.reason).not.toBeNull()
        expect(result.installmentOptions).toEqual([1, 2, 3, 4])
        expect(result.installmentOptions.length).toBe(4)
        expect(result.newInterestRate).toBe(0.05)
        expect(result.newTotalValue).toBe(110)
        expect(result.reason).toContain('manual renegotiation proposal')
        expect(result.reason).toContain('interest rate -> 5%')
    })

    it('should suggest manual renegotiation correctly with 10% interest rate', () => {
        const member = new Member('test')
        const box = new Box()
        box.joinMember(member)
    
        const input = {
            approved: true,
            member,
            date: getDataMenos30Dias().toString(),
            totalValue: { value: 200 },
            valueRequested: { value: 200 },
            remainingAmount: { value: 200 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'test',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [ getDataMenos30Dias().toString() ],
            uid: 'uid2',
            listOfMembersWhoHaveAlreadyApproved: [ member],
            payments: []
        }
    
        const loan = Loan.fromBox(input)
        const reneg = Renegotiation.create(loan)

        const result = SuggestManualRenegotiation(reneg, 10)
        
        expect(result.id).not.toBeNull()
        expect(result.reason).not.toBeNull()
        expect(result.installmentOptions).toEqual([1, 2, 3, 4])
        expect(result.installmentOptions.length).toBe(4)
        expect(result.newInterestRate).toBe(0.10)
        expect(result.newTotalValue).toBe(225)
        expect(result.reason).toContain('manual renegotiation proposal')
        expect(result.reason).toContain('interest rate -> 10%')
    })

    it('should suggest manual renegotiation correctly with 2.5% interest rate', () => {
        const member = new Member('test2')
        const box = new Box()
        box.joinMember(member)
    
        const input = {
            approved: true,
            member,
            date: getDataMenos30Dias().toString(),
            totalValue: { value: 50 },
            valueRequested: { value: 50 },
            remainingAmount: { value: 50 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'test2',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [ getDataMenos30Dias().toString() ],
            uid: 'uid3',
            listOfMembersWhoHaveAlreadyApproved: [ member],
            payments: []
        }
    
        const loan = Loan.fromBox(input)
        const reneg = Renegotiation.create(loan)

        const result = SuggestManualRenegotiation(reneg, 2.5)
        
        expect(result.id).not.toBeNull()
        expect(result.reason).not.toBeNull()
        expect(result.installmentOptions).toEqual([1, 2, 3, 4])
        expect(result.installmentOptions.length).toBe(4)
        expect(result.newInterestRate).toBe(0.025)
        expect(result.newTotalValue).toBe(56.25)
        expect(result.reason).toContain('manual renegotiation proposal')
        expect(result.reason).toContain('interest rate -> 2.5%')
    })
})
