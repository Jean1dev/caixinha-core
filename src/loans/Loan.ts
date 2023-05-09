import { Box } from "../boxes/Box"
import { Member } from "../members/Member"
import { Payment } from "../payment/Payment"
import { DecimalValue } from "../valueObjects/DecimalValue"
import { CreateLoanInput, FromBoxInput } from "./loan.types"
import crypto from 'crypto'

function generateUUID() {
    const uuid = crypto.randomBytes(16);
    uuid[6] = (uuid[6] & 0x0f) | 0x40;  // versão 4
    uuid[8] = (uuid[8] & 0x3f) | 0x80;  // variant RFC 4122
    return uuid.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/).slice(1).join('-');
}

export class Loan {
    private member: Member
    private memberName: string
    private date: Date
    private billingDates: Date[]
    private payments: Payment[]
    private valueRequested: DecimalValue
    private totalValue: DecimalValue
    private remainingAmount: DecimalValue
    private box: Box
    private interest: DecimalValue
    private fees: DecimalValue
    private requiredNumberOfApprovals: number
    private approvals: number
    private approved: boolean
    private description: string
    private uid: string

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
        this.payments = []
        this.uid = generateUUID()

        this.validate(true)
        this.memberName = this.member.memberName
        this.requiredNumberOfApprovals = this.box.totalMembers

        this.generateBillingDates()
    }

    public static fromBox(input: FromBoxInput): Loan {
        const l = new Loan({
            member: input.member,
            valueRequested: input.valueRequested.value,
            fees: input.fees.value,
            interest: input.interest.value,
            box: input.box,
            description: input.description
        })

        l.uid = input.uid
        l.approvals = input.approvals
        l.approved = input.approved
        l.billingDates = input.billingDates.map(billDate => (new Date(billDate)))
        return l
    }

    public addPayment(payment: Payment) {
        const paymentMember = payment._member.memberName
        if (this.memberName != paymentMember)
            throw new Error('Payment member not apply for this Loan')

        if (!this.approved)
            throw new Error('This loan is not approved yet')

        this.payments.push(payment)
        this.box.sumInCurrentBalance(payment._value)
        this.calculateRemainingAmount()
    }

    public addApprove() {
        this.approvals++
        if (this.requiredNumberOfApprovals == this.approvals) {
            this.approved = true
            this.completeLoan()
        }
    }

    private calculateRemainingAmount() {
        const totalPayments = this.payments.reduce(
            (acumulator, payment) => acumulator + payment._value, 0
        )

        this.remainingAmount = new DecimalValue(this.totalValue.val - totalPayments)
    }

    private completeLoan() {
        this.box.makeLoan(this)
        this.calculateTotalValue()
    }

    private calculateTotalValue() {
        const valueWithFee = this.valueRequested.val * (this.interest.val / 100)
        this.totalValue = new DecimalValue(this.valueRequested.val + valueWithFee + this.fees.val)
    }

    private generateBillingDates() {
        const dateIn30Days = new Date(this.date.getTime() + 30 * 24 * 60 * 60 * 1000)
        this.billingDates = [dateIn30Days]
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

        if (this.box && !this.box.memberIsOnThisBox(this.member)) {
            notificationMessages.push('This member is not a member of this box')
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

    public get isPaidOff() {
        if (this.remainingAmount.val <= 0)
            return true

        return false
    }

    public get value() {
        return this.valueRequested.val
    }

    public get _member() {
        return this.member
    }
}