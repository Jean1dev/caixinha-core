import { PerformanceValue } from "../../valueObjects/PerformanceValue";
import { Box } from "../Box";

export interface OutputAssetDevelopment {
    availableBalance: {
        data: number[]
    },
    portfolioBalance: {
        data: number[]
    }
}

interface ValueWithMonth {
    value: number
    month: number
}

function groupElementsByMonth(elements: ValueWithMonth[]): ValueWithMonth[][] {
    const groupedElements = {};
    elements.forEach(it => {
        const month = it.month;

        if (groupedElements[month]) {
            groupedElements[month].push(it);
        } else {
            groupedElements[month] = [it];
        }
    });

    return Object.values(groupedElements);
}

function verifyIfHadPositionInThatIndex(arr: ValueWithMonth[][], index: number): boolean {
    let result = false
    arr.forEach(it => {
        const finded = it.find(iterator => iterator.month === index)
        if (finded)
            result = true
    })

    return result
}

function getSumOfValueWithMonth(arr: ValueWithMonth[][], index: number): number {
    return arr
        .flatMap(it => it)
        .filter(it => it.month === index)
        .map(it => it.value)
        .reduce((sum, value) => sum + value, 0)
}

function ifFindPerformanceInThisMonthSum(performanceList: PerformanceValue[], total: number, month: number): number {
    const totalPerformance = performanceList
        .filter(it => it.month === month)
        .map(it => it._value.val)
        .reduce((sum, value) => sum + value, 0)

    return total + totalPerformance
}

function verifyIfRegisterIsUntil12MonthsLater(_date: Date): boolean {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 1)

    if (_date >= today) {
        return true
    }

    return false
}

export default function CalculateAssetDevlopment(box: Box): OutputAssetDevelopment {
    const output: OutputAssetDevelopment = {
        availableBalance: {
            data: []
        },
        portfolioBalance: {
            data: []
        }
    }
    const deposits: ValueWithMonth[] = box._deposits
        .filter(it => verifyIfRegisterIsUntil12MonthsLater(it._date))
        .map(it => ({
            value: it._value,
            month: it._date.getMonth() + 1
        }))

    const loans: ValueWithMonth[] = box._loans
        .filter(it => it.isApproved)
        .filter(it => verifyIfRegisterIsUntil12MonthsLater(it._date))
        .map(it => ({
            value: it.value,
            month: it._date.getMonth() + 1
        }))

    const payments: ValueWithMonth[] = box._loans
        .filter(it => it._isPaidOff)
        .filter(it => verifyIfRegisterIsUntil12MonthsLater(it._date))
        .flatMap(it => {
            const pays = it._payments.map(jit => ({
                value: jit._value,
                month: jit._date.getMonth() + 1
            }))

            return pays
        })

    const depositsGrouped = groupElementsByMonth(deposits)
    const loansGrouped = groupElementsByMonth(loans)
    const paymentsGrouped = groupElementsByMonth(payments)

    let totalLoans = 0, totalAsset = 0, totalPayments = 0
    let index = 1
    while (index < 13) {
        let valueDeposit: number = 0, valueLoan: number = 0, valuePayment: number = 0

        if (verifyIfHadPositionInThatIndex(depositsGrouped, index)) {
            valueDeposit = getSumOfValueWithMonth(depositsGrouped, index)
            totalAsset += valueDeposit
        }

        if (verifyIfHadPositionInThatIndex(loansGrouped, index)) {
            valueLoan = getSumOfValueWithMonth(loansGrouped, index)
            totalLoans += valueLoan
        }

        if (verifyIfHadPositionInThatIndex(paymentsGrouped, index)) {
            valuePayment = getSumOfValueWithMonth(paymentsGrouped, index)
            totalPayments += valuePayment
        }

        if (box._performance) {
            totalAsset = ifFindPerformanceInThisMonthSum(box._performance, totalAsset, index)
        }

        if (totalAsset == 0) {
            output.portfolioBalance.data.push(0)
        } else {
            output.portfolioBalance.data.push(totalAsset)
        }

        output.availableBalance.data.push(totalAsset - totalLoans + totalPayments)

        index++
    }

    return output
}