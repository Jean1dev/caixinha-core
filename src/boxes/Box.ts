import { Deposit } from "../deposits/Deposit"
import { Loan } from "../loans/Loan"
import { Member } from "../members/Member"
import { DecimalValue } from "../valueObjects/DecimalValue"

export class Box {
    private members: Member[]
    private currentBalance: DecimalValue
    private deposits: Deposit[]
    private loans: Loan[]

    constructor() {
        this.members = []
        this.currentBalance = new DecimalValue(0.0)
        this.deposits = []
        this.loans = []
        this.validate(true)
    }

    public static from(anotherBox: Box): Box {
        const box = new Box()
        box.members = [...anotherBox.members]
        box.currentBalance = new DecimalValue(anotherBox.currentBalance.val)
        box.deposits = [...anotherBox.deposits]
        box.loans = [...anotherBox.loans]
        box.validate(true)
        return box
    }

    public joinMember(member: Member) {
        const alreadyExists = this.members.map(m => m.memberName).includes(member.memberName)
        if (alreadyExists)
            throw new Error('This member already join in that box')
        
        this.members.push(member)
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []

        if (this.currentBalance.val < 0) {
            notificationMessages.push('currentBalance cannot be lower than 0')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new Error(errorMessage)
        }

        return notificationMessages
    }

    public sumInCurrentBalance(value: number) {
        this.currentBalance = new DecimalValue(this.currentBalance.val + value)
    }

    public deposit(deposit: Deposit) {
        this.verifyIfMemberIsOnThisBox(deposit._member)
        this.deposits.push(deposit)
        this.sumInCurrentBalance(deposit._value)
    }

    public makeLoan(loan: Loan) {
        this.verifyIfMemberIsOnThisBox(loan._member)
        this.loans.push(loan)
        this.currentBalance = new DecimalValue(this.currentBalance.val - loan.value)
    }

    private verifyIfMemberIsOnThisBox(member: Member) {
        const exists = this.members.map(m => m.memberName).includes(member.memberName)
        if (!exists)
            throw new Error('This member is not a member of thisbox')
    }

    public get balance(): number {
        return this.currentBalance.val
    }

    public get totalMembers() {
        return this.members.length
    }
}