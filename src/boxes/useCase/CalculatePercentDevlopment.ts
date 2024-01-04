import { Deposit } from "../../deposits/Deposit"
import { Loan } from "../../loans/Loan"
import { Box } from "../Box"

export interface IResultPercentDevlopment {
    totalDepositsPercent: number
    totalLoanCompletedPercent: number
    totalInterestPercent: number
}

function getPastMonth() {
    let pastMonth = new Date().getMonth() - 1
    if (pastMonth < 0)
        return 11

    return pastMonth
}

function calculateTotalDepositsOnPastMonth(deposits: Deposit[]): number {
    const pastMonth = getPastMonth()
    return deposits
        .filter(depo => {
            return depo._date.getMonth() == pastMonth
        })
        .map(depo => depo._value)
        .reduce((sum, value) => sum + value, 0)
}

function calculateTotalDepositsOnThisMonth(deposits: Deposit[]): number {
    const month = new Date().getMonth()
    return deposits
        .filter(depo => {
            return depo._date.getMonth() == month
        })
        .map(depo => depo._value)
        .reduce((sum, value) => sum + value, 0)
}

function calculateTotalLoanOnPastMonth(loans: Loan[]): number {
    const pastMonth = getPastMonth()
    return loans
        .filter(loa => loa._date.getMonth() == pastMonth)
        .map(loa => loa.value)
        .reduce((sum, value) => sum + value, 0)
}

function calculateTotalLoanOnThisMonth(loans: Loan[]): number {
    const month = new Date().getMonth()
    return loans
        .filter(loa => loa.isApproved)
        .filter(loa => loa._date.getMonth() == month)
        .map(loa => loa.value)
        .reduce((sum, value) => sum + value, 0)
}

function calculateTotalInterestPercent(box: Box): number {
    const total = box.balance
    const totalInterest = box._loans
        .filter(loa => loa._isPaidOff)
        .map(loan => {
            const totalPayments = loan._payments
                .map(pay => pay._value)
                .reduce((sum, value) => sum + value, 0)

            const interestMoreTaxesAndFees = totalPayments - loan.value
            return interestMoreTaxesAndFees
        })
        .reduce((sum, value) => sum + value, 0)
    return (totalInterest / total) * 100
}

function isNotValid(nu: number): boolean {
    if (isNaN(nu) || !isFinite(nu)) 
        return true

    return false
}

export default function CalculatePercentDevlopment(box: Box): IResultPercentDevlopment {
    const result: IResultPercentDevlopment = {
        totalDepositsPercent: 0,
        totalLoanCompletedPercent: 0,
        totalInterestPercent: 0
    }

    const totalDepositsOnPastMonth = calculateTotalDepositsOnPastMonth(box._deposits)
    const totalDepositsOnThisMonth = calculateTotalDepositsOnThisMonth(box._deposits)
    const gain = totalDepositsOnThisMonth - totalDepositsOnPastMonth
    result.totalDepositsPercent = (gain / totalDepositsOnPastMonth) * 100

    if (isNotValid(result.totalDepositsPercent)) {
        result.totalDepositsPercent = 0
    }

    const totalLoansOnPastMonth = calculateTotalLoanOnPastMonth(box._loans)
    const totalLoanOnThisMOnth = calculateTotalLoanOnThisMonth(box._loans)
    const loanGain = totalDepositsOnThisMonth - totalLoansOnPastMonth
    result.totalLoanCompletedPercent = (loanGain / totalLoanOnThisMOnth) * 100

    if (isNotValid(result.totalLoanCompletedPercent)) {
        result.totalLoanCompletedPercent = 0
    }

    result.totalInterestPercent = calculateTotalInterestPercent(box)

    if (isNotValid(result.totalInterestPercent)) {
        result.totalInterestPercent = 0
    }

    return result
}