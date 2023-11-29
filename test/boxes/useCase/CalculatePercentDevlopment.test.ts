import { Loan, Payment } from "../../../src"
import { Box } from "../../../src/boxes/Box"
import { Deposit } from "../../../src/deposits/Deposit"
import { Member } from "../../../src/members/Member"
import { CalculatePercentDevlopment } from '../../../src/useCase'

function box() {
    const now = new Date()
    const pastMonth = now
    pastMonth.setMonth(now.getMonth() - 1)
    
    const box = new Box()
    const member = new Member('joao jilberto')
    box.joinMember(member)

    box.deposit(new Deposit({
        member,
        value: 25,
        date: pastMonth
    }))

    box.deposit(new Deposit({
        member,
        value: 20,
    }))

    const loan = new Loan({
        box,
        interest: 5,
        member,
        valueRequested: 30,
    })

    loan.addApprove(member)

    loan.addPayment(new Payment({
        member,
        value: 40,
    }))

    return box
}

describe('CalculatePercentDevlopment test', () => {
    it('should be calculate correctly', () => {
        const result = CalculatePercentDevlopment(box())
        expect(result.totalDepositsPercent).toBe(-20)
        expect(result.totalInterestPercent.toFixed(2)).toBe("18.18")
        expect(result.totalLoanCompletedPercent.toFixed(2)).toBe("66.67")
    })
})
