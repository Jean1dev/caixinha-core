import { Box } from "../boxes/Box"
import { Member } from "../members/Member"
import { DecimalValue } from "../valueObjects/DecimalValue"

export interface CreateLoanInput {
    date?: Date
    member: Member
    valueRequested: number
    fees?: number
    interest?: number
    box: Box
    description?: string
}

export class Loan {
    private member: Member
    private memberName: string
    private date: Date
    private billingDates: Date[]
    private valueRequested: DecimalValue
    private box: Box
    private interest: DecimalValue
    private fees: DecimalValue
    private requiredNumberOfApprovals: number
    private approvals: number
    private approved: boolean
    private description: string

    constructor(input: CreateLoanInput) {
        this.approved = false
        this.member = input.member
        this.date = input.date || new Date()
        this.valueRequested = new DecimalValue(input.valueRequested)
        this.fees = new DecimalValue(input.fees || 0)
        this.interest = new DecimalValue(input.interest || 0)
        this.box = input.box
        this.approvals = 0
        this.description = input.description

        this.validate(true)
        this.memberName = this.member.memberName
        this.requiredNumberOfApprovals = this.box.totalMembers

        this.generateBillingDates()
    }

    public addApprove() {
        this.approvals++
        if (this.requiredNumberOfApprovals == this.approvals) {
            this.approved = true
        }
    }

    private generateBillingDates() {
        const dateIn30Days = new Date(this.date.getTime() + 30 * 24 * 60 * 60 * 1000)
        this.billingDates = [ dateIn30Days ]
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.valueRequested.val < 0) {
            notificationMessages.push('value cannot be lower than 0')
        }

        if (!this.member) {
            notificationMessages.push('member cannot be null')
        }

        if (!this.box) {
            notificationMessages.push('box cannot be null')
        }

        if (this.box && this.validadeIfBoxHasFunds()) {
            notificationMessages.push('box does not have enough funds')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new Error(errorMessage)
        }

        return notificationMessages
    }

    private validadeIfBoxHasFunds(): boolean {
        const currentBalance = this.box.balance
        if (this.valueRequested.val > currentBalance)
            return true

        return false
    }

    public get listOfBillingDates() {
        return this.billingDates
    }

    public get isApproved() {
        return this.approved
    }
}