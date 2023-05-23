import { Member } from "../members/Member"
import { BankReceipt } from "../valueObjects/BankReceipt"
import { DecimalValue } from "../valueObjects/DecimalValue"

export interface CreateDepositInput {
    date?: Date
    member: Member
    value: number
}

export interface FromBoxInput {
    date: Date
    member: Member
    value: number
}

export class Deposit {
    private date: Date
    private member: Member
    private memberName: String
    private value: DecimalValue
    private bankReceipt: BankReceipt

    constructor(input: CreateDepositInput) {
        this.date = input.date || new Date()
        this.member = input.member
        this.value = new DecimalValue(input.value)
        this.validate(true)

        this.memberName = this.member.memberName
    }

    public addProofReceipt(url: string) {
        if (!this.bankReceipt)
            this.bankReceipt = new BankReceipt(url)
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.value.val <= 0) {
            notificationMessages.push('value cannot be 0 or lower')
        }

        if (!this.member) {
            notificationMessages.push('member cannot be null')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new Error(errorMessage)
        }

        return notificationMessages
    }

    public get _value() {
        return this.value.val
    }

    public get _member() {
        return this.member
    }
}