import { Member } from "../../members/Member";
import { getDifferenceBetweenDates } from "../../utils";
import { Loan } from "../Loan";

export interface CreditRiskOutput {
    message: string
    risk: number
    member: Member
    quantity: number
}

function getLastDayofPayment(loan: Loan): Date {
    const lastPayment = loan._payments[loan._payments.length - 1]
    if (!lastPayment) {
        return loan.listOfBillingDates[loan.listOfBillingDates.length - 1]
    }

    return lastPayment._date
}

function getLateLoans(loans: Loan[]): Loan[] {
    return loans.filter(loan => {
        const today = new Date()
        const lastDateForPay = loan.lastDayForPay

        if (loan._payments.length > 0) {
            const dateLastPayment = getLastDayofPayment(loan)
            if (dateLastPayment > lastDateForPay) {
                return true
            }

            return false
        }

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

function filterLateLoans(collection: Loan[], members: Member[]): { memberName: string, memberLoans: Loan[] }[] {
    return members
        .map(member => member.memberName)
        .map(memberName => {
            const memberLoans = collection.filter(loan => loan._member.memberName === memberName)
            return { memberName, memberLoans }
        }).filter(memberWithLoan => {
            const howManyLateLoans = getLateLoans(memberWithLoan.memberLoans)

            if (howManyLateLoans.length == 0) {
                return false
            }

            return true
        })
}

export default function GenerateCreditRisk(collection: Loan[], members: Member[]): CreditRiskOutput[] {
    const output = []
    const memberRisksLoan = filterLateLoans(collection, members)

    memberRisksLoan.forEach(memberWithLoan => {
        let messages = []
        const lateLoans = getLateLoans(memberWithLoan.memberLoans)
        lateLoans.forEach(loan => {
            const lastDateForPay = loan.lastDayForPay

            if (loan._isPaidOff) {
                const diff = getDifferenceBetweenDates(getLastDayofPayment(loan), lastDateForPay)
                messages.push(`Loan ${loan['description']} was payed outside a due date - ${diff} days`)
            } else {
                const diff = getDifferenceBetweenDates(new Date(), lastDateForPay)
                messages.push(`Loan ${loan.UUID} is late by ${diff} days`)
            }
        })

        const diff = getDiffOfDueLoansAndCompletedLoans(collection, memberWithLoan.memberName)

        output.push({
            quantity: lateLoans.length,
            message: messages.join('\n'),
            risk: (diff * 10) / 100,
            member: new Member(memberWithLoan.memberName)
        })
    })

    return output
}