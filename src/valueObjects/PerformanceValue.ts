import { PerformanceJson } from "../boxes/box.types";
import DomainError from "../error/DomainError";
import { DecimalValue } from "./DecimalValue";

export class PerformanceValue {
    private value: DecimalValue
    private monthNumber: number
    private yearNumber: number

    private constructor() { }

    public static build(value: DecimalValue, date: Date): PerformanceValue {
        const p = new PerformanceValue()
        p.value = value
        p.monthNumber = date.getMonth() + 1
        p.yearNumber = date.getFullYear()
        p.validate(true)
        return p
    }

    public static fromJson(json: PerformanceJson): PerformanceValue {
        const p = new PerformanceValue()
        p.value = DecimalValue.from(json.value)
        p.monthNumber = json.monthNumber
        p.yearNumber = json.yearNumber
        p.validate(true)
        return p
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.monthNumber < 1 || this.monthNumber > 12) {
            notificationMessages.push('monthNumber must be a number into range 1~12')
        }

        if (this.yearNumber < 2023) {
            notificationMessages.push('yearNumber cannot be last than 2023')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new DomainError(errorMessage)
        }

        return notificationMessages
    }

    public get month() {
        return this.monthNumber
    }

    public get _value() {
        return this.value
    }
}