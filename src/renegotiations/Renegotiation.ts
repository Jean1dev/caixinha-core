import DomainError from "../error/DomainError"
import { Loan } from "../loans/Loan"
import { Member } from "../members/Member"
import { getDifferenceBetweenDates } from "../utils"
import { DecimalValue } from "../valueObjects/DecimalValue"
import { RenegotiationJsonType } from "./Renegotiation.types"

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

    public static fromJson(json: RenegotiationJsonType): Renegotiation {
        const reneg = new Renegotiation()
        reneg.oldLoan = Loan.fromBox(json.oldLoan)
        reneg.newLoan = json.newLoan ? Loan.fromBox(json.newLoan) : null
        reneg.status = json.status
        reneg.delayedDays = json.delayedDays
        reneg.createdAt = new Date(json.createdAt)
        reneg.finishedAt = json.finishedAt ? new Date(json.finishedAt) : null
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

    public validate(throwIFException = false): string[] {
        const errors = []
        if (this.finishedAt) {
            errors.push("renegotiation is already finished")
        }

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