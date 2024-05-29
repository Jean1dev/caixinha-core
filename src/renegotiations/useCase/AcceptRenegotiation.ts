import { Box } from "../../boxes/Box";
import DomainError from "../../error/DomainError";
import { Loan } from "../../loans/Loan";
import { CreateLoanInput } from "../../loans/loan.types";
import { Member } from "../../members/Member";
import { Renegotiation } from "../Renegotiation";

interface RenegotiationSuggestInput {
    newTotalValue: number
    installmentOptions: number
}

interface AcceptRenegotiationOutput {
    reneg: Renegotiation
    newLoan: Loan
}

export default function AcceptRenegotiation(
    box: Box,
    renegotiation: Renegotiation,
    member: Member,
    input: RenegotiationSuggestInput
): AcceptRenegotiationOutput {
    
    applyValidations(renegotiation, member, input)
    
    const today = new Date()
    const newLoan: CreateLoanInput = {
        member,
        valueRequested: input.newTotalValue,
        interest: 0,
        box,
        description: `Renegotiation ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`,
        installments: input.installmentOptions,
        skipValidate: true
    }
    
    const newLoanEntity = createLoanAndAprove(newLoan)

    removeOldLoanFromBox(renegotiation, box)

    renegotiation.complete(newLoanEntity)

    return {
        reneg: renegotiation,
        newLoan: newLoanEntity
    }
}

function createLoanAndAprove(input: CreateLoanInput): Loan {
    const loan = new Loan(input)
    input.box._members.forEach(m => {
        loan.addApprove(m)
    })

    return loan
}

function applyValidations(renegotiation: Renegotiation, member: Member, input: RenegotiationSuggestInput) {
    if (input.installmentOptions <= 0 || input.newTotalValue <= 0) {
        throw new DomainError("Invalid input")
    }

    if (renegotiation.owner.memberName !== member.memberName) {
        throw new DomainError("You are not the owner of this loan")
    }
}
function removeOldLoanFromBox(renegotiation: Renegotiation, box: Box) {
    const uuid = renegotiation.originLoan.UUID
    box.removeLoan(uuid)
}

