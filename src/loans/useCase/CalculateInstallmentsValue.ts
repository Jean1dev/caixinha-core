import { DecimalValue } from "../../valueObjects/DecimalValue";

interface IoutputInstallmentsCalculated {
    value: number,
    date?: Date
}

export default function CalculateInstallmentsValue(totalValue: DecimalValue | number, numberOfInstallments: number): IoutputInstallmentsCalculated[] {
    let workValue
    if (totalValue instanceof DecimalValue) {
        workValue = totalValue.val
    } else {
        workValue = totalValue
    }

    if (numberOfInstallments < 1) {
        throw new Error('parameter numberOfInstallments cannot be lower equal than 1')
    }

    const valueOfInstallments = Number((workValue / numberOfInstallments).toFixed(2))
    const result: IoutputInstallmentsCalculated[] = []

    for (let index = 0; index < numberOfInstallments; index++) {
        result.push({
            value: valueOfInstallments
        })
    }

    return result
}