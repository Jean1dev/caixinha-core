import { Box } from "../boxes/Box";
import { Deposit } from "../deposits/Deposit";
import { Loan } from "../loans/Loan";
import { Member } from "../members/Member";

export interface FinanceOperation {
    date: Date
    value: number
}

export interface OutputBankStatement {
    boxName: string
    member: Member
    deposits: FinanceOperation[]
    loans: FinanceOperation[]
    totalDeposits: number
    totalLoans: number
}

function remap(data: Deposit[] | Loan[]): FinanceOperation[] {
    return data.map(it => ({ date: it._date, value: it._value }))
}

function getMyDeposit(email: string, data: Deposit[]): Deposit[]{
    return data.filter(it => it._member._email === email)
}

function getMyLoan(email: string, data: Loan[]): Loan[]{
    return data.filter(it => it._member._email === email)
}

export default function GenerateBankStatement(member: Member, boxList: Box[]): OutputBankStatement[] {
    const result: OutputBankStatement[] = []

    const filteredBoxs = boxList.filter(box => box.memberIsOnThisBox(member))
    for (const box of filteredBoxs) {
        const deposits = getMyDeposit(member._email, box._deposits)
        const loans = getMyLoan(member._email, box._loans)

        const totalDeposits = deposits.reduce((acc, deposit) => acc + deposit._value, 0)
        const totalLoans = loans.reduce((acc, loan) => acc + loan.value, 0)

        result.push({
            boxName: box._name,
            member,
            deposits: remap(deposits),
            loans: remap(loans),
            totalDeposits,
            totalLoans
        })
    }
    return result
}