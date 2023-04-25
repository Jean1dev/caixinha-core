import { Member } from "../members/Member"
import { DecimalValue } from "../valueObjects/DecimalValue"

export interface CreateDepositInput {
    date?: Date
    member: Member
    value: number
}

export class Deposit {
    private date: Date
    private member: Member
    private memberName: String
    private value: DecimalValue

    constructor(input: CreateDepositInput) {
        this.date = input.date || new Date()
        this.member = input.member
        this.value = new DecimalValue(input.value)
        this.validate(true)

        this.memberName = this.member.memberName
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.value.val < 0) {
            notificationMessages.push('value cannot be lower than 0')
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
}