import { GenerateCreditRisk } from "../../useCase";
import { generateUUID } from "../../utils";
import { Renegotiation } from "../Renegotiation";

interface RenegotiationSuggestOutput {
    installmentOptions: number[]
    newInterestRate: number
    reason: string
    newTotalValue: number
    id: string
}

function calculateNewInterestRate(risk: number): number {
    return risk / 100
}

export default function SuggestRenegotiationSimpleInterest(entity: Renegotiation): RenegotiationSuggestOutput {
    const member = entity.owner
    const loan = entity.originLoan
    const updatedLoanValue = loan._remainingAmount
    const risk = GenerateCreditRisk([loan], [member])[0]
    const installmentOptions = [1, 2, 3, 4, 5]

    const newInterestRate = calculateNewInterestRate(risk.risk)
    const increaseValue = updatedLoanValue * newInterestRate
    const newTotalValue = updatedLoanValue + increaseValue

    const reason = `
        ${member.memberName} you have a credit risk of ${risk.risk}
        suggested proposal 
        outstanding amount -> R$ ${updatedLoanValue}
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

