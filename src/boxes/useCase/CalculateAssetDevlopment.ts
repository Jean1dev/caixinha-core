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

export default function CalculateAssetDevlopment(box: Box, monthForCalculate = new Date().getMonth() + 1): OutputAssetDevelopment {
    const output: OutputAssetDevelopment = {
        availableBalance: {
            data: []
        },
        portfolioBalance: {
            data: []
        }
    }
    const deposits: ValueWithMonth[] = box._deposits.map(it => ({
        value: it._value,
        month: it._date.getMonth() + 1
    }))

    const loans: ValueWithMonth[] = box._loans
        .filter(it => it.isApproved)
        .map(it => ({
            value: it.value,
            month: it._date.getMonth() + 1
        }))

    const depositsGrouped = groupElementsByMonth(deposits)
    const loansGrouped = groupElementsByMonth(loans)

    let totalAsset = 0
    let index = 1
    while (index < 13) {
        if (index <= monthForCalculate) {
            let valueDeposit: number = 0, valueLoan: number = 0

            if (verifyIfHadPositionInThatIndex(depositsGrouped, index)) {
                valueDeposit = getSumOfValueWithMonth(depositsGrouped, index)
                totalAsset += valueDeposit
            }

            if (verifyIfHadPositionInThatIndex(loansGrouped, index)) {
                valueLoan = getSumOfValueWithMonth(loansGrouped, index)
            }

            output.portfolioBalance.data.push(totalAsset)
            output.availableBalance.data.push(totalAsset - valueLoan)
        } else {
            output.portfolioBalance.data.push(0)
            output.availableBalance.data.push(0)
        }

        index++
    }

    return output
}