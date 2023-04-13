import { Deposit } from "../deposits/Deposit"
import { Loan } from "../loans/Loan"
import { Member } from "../members/Member"
import { DecimalValue } from "../valueObjects/DecimalValue"

export class Box {
    private members: Member[]
    private currentBalance: DecimalValue
    private deposits: Deposit[]
    private loans: Loan[]

    constructor() {
        this.members = []
        this.currentBalance = new DecimalValue(0.0)
        this.deposits = []
        this.loans = []
        this.validate(true)
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.currentBalance.val < 0) {
            notificationMessages.push('currentBalance cannot be lower than 0')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new Error(errorMessage)
        }

        return notificationMessages
    }

    private sumInCurrentBalance(value: number) {
        this.currentBalance = new DecimalValue(this.currentBalance.val + value)
    }

    public deposit(deposit: Deposit) {
        this.deposits.push(deposit)
        this.sumInCurrentBalance(deposit._value)
    }

    public get balance(): number {
        return this.currentBalance.val
    }

    public get totalMembers() {
        return this.members.length
    }
}