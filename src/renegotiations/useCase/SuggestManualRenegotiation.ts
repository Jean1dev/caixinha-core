import { generateUUID } from "../../utils";
import { Renegotiation } from "../Renegotiation";

interface RenegotiationSuggestOutput {
    installmentOptions: number[]
    newInterestRate: number
    reason: string
    newTotalValue: number
    id: string
}

function calculateNewInterestRate(interestRate: number): number {
    return interestRate / 100
}

export default function SuggestManualRenegotiation(entity: Renegotiation, interestRate: number): RenegotiationSuggestOutput {
    const member = entity.owner
    const loan = entity.originLoan
    const updatedLoanValue = loan._remainingAmount
    const installmentOptions = [1, 2, 3, 4]

    const newInterestRate = calculateNewInterestRate(interestRate)
    const increaseValue = updatedLoanValue * newInterestRate
    const newTotalValue = updatedLoanValue + increaseValue

    const reason = `
        ${member.memberName} manual renegotiation proposal
        outstanding amount -> R$ ${updatedLoanValue}
        interest rate -> ${interestRate}%
        increase value -> R$ ${increaseValue.toFixed(2)}
        new total -> R$ ${newTotalValue.toFixed(2)}
        in up to ${installmentOptions.length} installments
    `

    return {
        id: generateUUID(),
        reason,
        installmentOptions,
        newInterestRate,
        newTotalValue
    }
}
