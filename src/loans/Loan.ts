import { Box } from "../boxes/Box"
import DomainError from "../error/DomainError"
import { Member } from "../members/Member"
import { Payment } from "../payment/Payment"
import { BankReceipt } from "../valueObjects/BankReceipt"
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
    private listOfMembersWhoHaveAlreadyApproved: Member[]
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
    private bankReceipt: BankReceipt
    private isPaidOff: boolean
    private installments: number

    constructor(input: CreateLoanInput) {
        this.approved = false
        this.member = input.member
        this.date = input.date || new Date()
        this.valueRequested = DecimalValue.from(input.valueRequested)
        this.fees = DecimalValue.from(input.fees || 0)
        this.interest = DecimalValue.from(input.interest || 0)
        this.box = input.box
        this.approvals = 0
        this.description = input.description
        this.payments = []
        this.uid = generateUUID()
        this.installments = input.installments

        if (!input.skipValidate)
            this.validate(true)

        this.memberName = this.member.memberName
        this.requiredNumberOfApprovals = this.box.totalMembers
        this.listOfMembersWhoHaveAlreadyApproved = []

        this.generateBillingDates()
        this.calculateTotalValue()
    }

    public static fromBox(input: FromBoxInput): Loan {
        const l = new Loan({
            member: input.member,
            valueRequested: input.valueRequested.value,
            fees: input.fees.value,
            interest: input.interest.value,
            box: input.box,
            description: input.description,
            skipValidate: true,
            date: new Date(input.date)
        })

        l.installments = input.installments
        l.isPaidOff = input.isPaidOff
        l.uid = input.uid
        l.approvals = input.approvals
        l.approved = input.approved
        l.listOfMembersWhoHaveAlreadyApproved = input.listOfMembersWhoHaveAlreadyApproved
        l.billingDates = input.billingDates.map(billDate => (new Date(billDate)))
        l.totalValue = DecimalValue.from(input?.totalValue?.value || 0)
        l.remainingAmount = DecimalValue.from(input?.remainingAmount?.value || 0)
        return l
    }

    public addPayment(payment: Payment) {
        const paymentMember = payment._member.memberName
        if (this.memberName != paymentMember)
            throw new DomainError('Payment member not apply for this Loan')

        if (!this.approved)
            throw new DomainError('This loan is not approved yet')

        if (payment._value <= 0)
            throw new DomainError('Payment cannot be 0 or lower')

        this.payments.push(payment)
        this.box.sumInCurrentBalance(payment._value)
        this.calculateRemainingAmount()
    }

    public addApprove(hosApprove: Member) {
        if (!this.box.memberIsOnThisBox(hosApprove)) {
            throw new DomainError('This member cannot approve this loan because he is no member of this box')
        }

        this.addMemberWhoApproved(hosApprove)
        this.approvals++
        if (this.approvals >= this.requiredNumberOfApprovals) {
            this.approved = true
            this.completeLoan()
        }
    }

    private addMemberWhoApproved(memberApproved: Member) {
        const exists = this.listOfMembersWhoHaveAlreadyApproved.map(m => m.memberName).includes(memberApproved.memberName)
        if (exists)
            throw new DomainError('This member have already approve this loan')

        this.listOfMembersWhoHaveAlreadyApproved.push(memberApproved)
    }

    private calculateRemainingAmount() {
        const totalPayments = this.payments.reduce(
            (acumulator, payment) => acumulator + payment._value, 0
        )

        if (totalPayments >= this.totalValue.val) {
            this.isPaidOff = true
        }

        this.remainingAmount = DecimalValue.from(this.totalValue.val - totalPayments)
    }

    private completeLoan() {
        this.box.makeLoan(this)
        this.calculateTotalValue()
    }

    private calculateTotalValue() {
        const valueWithFee = this.valueRequested.val * (this.interest.val / 100)
        this.totalValue = DecimalValue.from(this.valueRequested.val + valueWithFee + this.fees.val)
    }

    private generateBillingDates() {
        if (this.installments) {
            const paydays = []
            const firstPayDay = new Date(this.date.getTime() + 30 * 24 * 60 * 60 * 1000)
            for (let index = 0; index < this.installments; index++) {
                if (index == 0) {
                    paydays.push(firstPayDay)
                } else {
                    const nextPayDay = new Date(paydays[index - 1].getTime() + 30 * 24 * 60 * 60 * 1000)
                    paydays.push(nextPayDay)
                }
            }

            this.billingDates = paydays
            return
        }

        const dateIn30Days = new Date(this.date.getTime() + 30 * 24 * 60 * 60 * 1000)
        this.billingDates = [dateIn30Days]
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.valueRequested.val < 0) {
            notificationMessages.push('value cannot be lower than 0')
        }

        if (this.installments && this.installments < 0) {
            notificationMessages.push('intallments cannot be lower than 0')
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
            throw new DomainError(errorMessage)
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

    public get value() {
        return this.valueRequested.val
    }

    public get _member() {
        return this.member
    }

    public get UUID() {
        return this.uid
    }

    public get _remainingAmount() {
        return this.remainingAmount.val
    }

    public get _isPaidOff() {
        if (!this.isPaidOff)
            return false

        return this.isPaidOff
    }

    public get _date() {
        return this.date
    }
}