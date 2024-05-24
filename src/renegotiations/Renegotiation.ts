import DomainError from "../error/DomainError"
import { Loan } from "../loans/Loan"
import { Member } from "../members/Member"
import { getDifferenceBetweenDates } from "../utils"
import { DecimalValue } from "../valueObjects/DecimalValue"

export class Renegotiation {
    private createdAt: Date
    private finishedAt: Date
    private newFees: DecimalValue
    private installments: number
    private oldLoan: Loan
    private newLoan: Loan
    private status: 'PENDING' | 'FINISHED'
    private delayedDays: number

    private constructor() { }

    public static create(oldLoan: Loan): Renegotiation {
        const reneg = new Renegotiation()
        reneg.oldLoan = oldLoan
        reneg.createdAt = new Date()
        reneg.status = 'PENDING'
        reneg.delayedDays = reneg.calculateDelayedDays()
        reneg.validate(true)
        return reneg
    }

    public complete(newLoan: Loan) {
        this.finishedAt = new Date()
        this.status = 'FINISHED'
        this.newLoan = newLoan
    }

    public calculateDelayedDays(): number {
        const lastDayForPay = this.oldLoan.lastDayForPay
        const today = new Date()
        const diffInDays = getDifferenceBetweenDates(today, lastDayForPay)
        return diffInDays
    }

    public validate(throwIFException = false): String[] {
        const errors = []
        if (this.oldLoan._isPaidOff) {
            errors.push("loan has already been paid")
        }

        if (!this.oldLoan.isApproved) {
            errors.push("loan is not approved")
        }

        if (this.delayedDays < 30) {
            errors.push("Loan is not late, it is not possible to renegotiate")
        }

        if (throwIFException && errors.length > 0) {
            const errorMessage = errors.join(', ')
            throw new DomainError(errorMessage)
        }
        return errors
    }

    public get owner(): Member {
        return this.oldLoan._member
    }

    public get originLoan(): Loan {
        return this.oldLoan
    }
}