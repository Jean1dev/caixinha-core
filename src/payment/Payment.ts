import { Member } from "../members/Member";
import { stringToDate } from "../utils";
import { DecimalValue } from "../valueObjects/DecimalValue";

interface PaymentCreateInput {
    member: Member
    value: number
    description?: string
    date?: Date
}

export class Payment {
    private member: Member
    private date: Date
    private value: DecimalValue
    private description: string

    constructor(input: PaymentCreateInput) {
        this.member = input.member
        this.date = stringToDate(input.date)
        this.value = DecimalValue.from(input.value)
        this.description = input.description
    }

    public get _member() {
        return this.member
    }

    public get _value() {
        return this.value.val
    }

    public get _date() {
        return this.date
    }
}