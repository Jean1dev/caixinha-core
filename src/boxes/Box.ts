import { Deposit } from "../deposits/Deposit"
import DomainError from "../error/DomainError"
import { Loan } from "../loans/Loan"
import { Member } from "../members/Member"
import { Payment } from "../payment/Payment"
import { BankAccount } from "../valueObjects/BankAccount"
import { DecimalValue } from "../valueObjects/DecimalValue"
import { PerformanceValue } from "../valueObjects/PerformanceValue"
import { BoxJsonType } from "./box.types"

export class Box {
    private name: string
    private members: Member[]
    private currentBalance: DecimalValue
    private deposits: Deposit[]
    private performance: PerformanceValue[]
    private loans: Loan[]
    private bankAccount: BankAccount

    constructor() {
        this.members = []
        this.currentBalance = DecimalValue.from(0.0)
        this.deposits = []
        this.loans = []
        this.validate(true)
    }

    public static fromJson(jsonBox: BoxJsonType): Box {
        const box = new Box()
        box.name = jsonBox.name
        box.members = jsonBox.members.map(member => Member.build({ name: member.name, email: member.email }))
        box.currentBalance = DecimalValue.from(jsonBox.currentBalance)

        box.deposits = jsonBox.deposits.map(deposit => {
            return new Deposit({
                date: new Date(deposit.date),
                member: Member.build({ name: deposit.memberName, email: deposit.member.email }),
                value: deposit.value
            })
        })

        box.loans = jsonBox.loans.map(loan => {
            return Loan.fromBox({
                approved: loan.approved,
                member: Member.build({ name: loan.memberName, email: loan.member.email }),
                date: loan.date,
                valueRequested: loan.valueRequested,
                fees: loan.fees,
                interest: loan.interest,
                box: box,
                approvals: loan.approvals,
                description: loan.description,
                payments: loan.payments.map(p => {
                    return new Payment({
                        member: Member.build({ name: loan.memberName, email: loan.member.email }),
                        value: p.value,
                        description: p.description,
                        date: p.date
                    })
                }),
                memberName: loan.memberName,
                requiredNumberOfApprovals: loan.requiredNumberOfApprovals,
                billingDates: loan.billingDates,
                uid: loan.uid,
                totalValue: loan.totalValue,
                remainingAmount: loan.remainingAmount,
                listOfMembersWhoHaveAlreadyApproved: loan.listOfMembersWhoHaveAlreadyApproved
                    ? loan.listOfMembersWhoHaveAlreadyApproved.map(m => (Member.build({ name: m.name, email: m.email })))
                    : [],
                isPaidOff: loan.isPaidOff,
                installments: loan.installments
            })
        })

        if (jsonBox.performance) {
            box.performance = jsonBox.performance.map(it => PerformanceValue.fromJson(it))
        }

        if (jsonBox.bankAccount) {
            box.bankAccount = new BankAccount(jsonBox.bankAccount.keysPix, jsonBox.bankAccount.urlsQrCodePix)
        }

        box.validate(true)
        return box
    }

    public addPerformance(value: number) {
        const result = PerformanceValue.build(DecimalValue.from(value), new Date())
        if (!this.performance) {
            this.performance = []
        }

        this.performance.push(result)
        this.sumInCurrentBalance(value)
    }

    public removeMember(member: Member) {
        const loansThatMember = this.loans.filter(loan => loan._member._email === member._email)
        if (loansThatMember.length == 0) {
            this.members = this.members.filter(m => m._email !== member._email)
            return
        }

        const pendingLoans = loansThatMember.filter(loan => !loan.thisMemberCanCanceledThisLoan())
        if (pendingLoans.length > 0) {
            throw new DomainError('Cannot continue because this member has pending loans')
        }
        this.members = this.members.filter(m => m._email !== member._email)
    }

    public getLoanByUUID(loanUUID: string): Loan {
        const loan = this.loans.find(l => l.UUID === loanUUID)
        if (!loan)
            throw new DomainError('Loan not found')

        return loan
    }

    public addBankAccount(keyPix: string | null, qrCode: string | null) {
        if (!this.bankAccount) {
            this.bankAccount = new BankAccount([], [])
        }

        this.bankAccount.add(keyPix, qrCode)
    }

    public joinMember(member: Member) {
        const alreadyExists = this.members.map(m => m.memberName).includes(member.memberName)
        if (alreadyExists)
            throw new DomainError('This member already join in that box')

        this.members.push(member)
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.currentBalance.val < 0) {
            notificationMessages.push('currentBalance cannot be lower than 0')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new DomainError(errorMessage)
        }

        return notificationMessages
    }

    public sumInCurrentBalance(value: number) {
        this.currentBalance = DecimalValue.from(this.currentBalance.val + value)
    }

    public deposit(deposit: Deposit) {
        this.verifyIfMemberIsOnThisBox(deposit._member)
        this.deposits.push(deposit)
        this.sumInCurrentBalance(deposit._value)
    }

    public makeLoan(loan: Loan) {
        this.verifyIfMemberIsOnThisBox(loan._member)
        this.loans.push(loan)
        this.currentBalance = DecimalValue.from(this.currentBalance.val - loan.value)
    }

    public memberIsOnThisBox(member: Member): boolean {
        const exists = this.members.map(m => m.memberName).includes(member.memberName)
        if (!exists)
            return false

        return true
    }

    private verifyIfMemberIsOnThisBox(member: Member) {
        const exists = this.members.map(m => m.memberName).includes(member.memberName)
        if (!exists)
            throw new DomainError('This member is not a member of this box')
    }

    public get balance(): number {
        return this.currentBalance.val
    }

    public get totalMembers() {
        return this.members.length
    }

    public get _deposits() {
        return this.deposits
    }

    public get _loans() {
        return this.loans
    }

    public get _performance() {
        return this.performance
    }
}