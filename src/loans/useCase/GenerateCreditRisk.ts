import { Member } from "../../members/Member";
import { getDifferenceBetweenDates } from "../../utils";
import { Loan } from "../Loan";

interface CreditRiskOutput {
    message: string
    risk: number
    member: Member
}

function getLateLoans(loans: Loan[]): Loan[] {
    return loans.filter(loan => {
        const today = new Date()
        const lastDateForPay = loan.lastDayForPay

        if (today > lastDateForPay) {
            return true
        } else {
            return false
        }
    })
}

function getDiffOfDueLoansAndCompletedLoans(loans: Loan[], member: string): number {
    const completedLoans = loans
        .filter(loan => loan._member.memberName === member)
        .filter(loan => {
            return loan._isPaidOff
        })

    const diff = completedLoans.length - loans.length

    if (diff < 0) {
        return diff * -1
    }

    return diff
}

export default function GenerateCreditRisk(collection: Loan[], members: Member[]): CreditRiskOutput[] {
    const output = []
    const memberRisksLoan = members
        .map(member => member.memberName)
        .map(memberName => {
            const memberLoans = collection.filter(loan => loan._member.memberName === memberName)
            return { memberName, memberLoans }
        }).filter(memberWithLoan => {
            const havePendingLoan = memberWithLoan.memberLoans.filter(loan => {
                if (loan._isPaidOff) return false

                return true
            })

            if (havePendingLoan.length > 0) {
                return false
            }

            const howManyLateLoans = getLateLoans(memberWithLoan.memberLoans)

            if (howManyLateLoans.length > 0) {
                return false
            }

            return true
        })

    memberRisksLoan.forEach(memberWithLoan => {
        let messages = []
        const lateLoans = getLateLoans(memberWithLoan.memberLoans)
        lateLoans.forEach(loan => {
            const today = new Date()
            const lastDateForPay = loan.lastDayForPay
            const diff = getDifferenceBetweenDates(today, lastDateForPay)
            messages.push(`Loan ${loan.UUID} is late by ${diff} days`)
        })

        const diff = getDiffOfDueLoansAndCompletedLoans(collection, memberWithLoan.memberName)

        output.push({
            message: messages.join('\n'),
            risk: (diff * 10) / 100,
            member: new Member(memberWithLoan.memberName)
        })
    })

    return output
}