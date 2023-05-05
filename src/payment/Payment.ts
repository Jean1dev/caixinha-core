import { Member } from "../members/Member";
import { DecimalValue } from "../valueObjects/DecimalValue";

export class Payment {
    private member: Member
    private date: Date
    private value: DecimalValue
    private description: string

    constructor(member: Member, value: number, description?: string) {
        this.member = member
        this.date = new Date()
        this.value = new DecimalValue(value)
        this.description = description
    }

    public get _member() {
        return this.member
    }

    public get _value() {
        return this.value.val
    }
}