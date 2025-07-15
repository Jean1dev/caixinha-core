import { Box } from '../../src/boxes/Box'
import { Deposit } from '../../src/deposits/Deposit'
import { Loan } from '../../src/loans/Loan'
import { CreateLoanInput } from '../../src/loans/loan.types'
import { Member } from '../../src/members/Member'
import { Payment } from '../../src/payment/Payment'

describe('Box class test', () => {
    it('should be create a Box', () => {
        const box = new Box()
        expect(0.0).toBe(box.balance)
    })

    it('should be possible make a deposit', () => {
        const box = new Box()
        const member = new Member('juca')
        const deposit = new Deposit({
            member,
            value: 25
        })

        box.joinMember(member)
        box.deposit(deposit)

        expect(deposit._value).toBe(box.balance)

        const anotherDeposit = new Deposit({
            member: new Member('juca'),
            value: 25.89
        })

        box.deposit(anotherDeposit)

        expect(50.89).toBe(box.balance)
    })

    it('should be apply all join member rules', () => {
        const box = new Box()
        const member = new Member('juca')

        box.joinMember(member)

        expect(1).toBe(box.totalMembers)

        try {
            box.joinMember(member)
        } catch (e) {
            expect(e.message).toBe('This member already join in that box')
        }

        expect(1).toBe(box.totalMembers)

        box.joinMember(new Member('jean'))
        expect(2).toBe(box.totalMembers)
    })

    it('shoud be create a box from json', () => {
        const json = require('./box.json')
        const box = Box.fromJson(json)
        expect(json['currentBalance']['value']).toBe(box.balance)
        expect(json['members'].length).toBe(box.totalMembers)
    })

    it('shoud be add many bank accounts', () => {
        const box = new Box()
        box.addBankAccount('pix', 'qrcode')
        box.addBankAccount('pix', 'qrcode')
        box.addBankAccount('pix', null)
    })

    it('should be abble to make payment from box json', () => {
        const json = require('./efetuar-pagamento-box.json')
        const box = Box.fromJson(json)

        const loanUid = '930367ef-1363-44b3-99bb-1da0d8a0ca4b'
        const currentBalance = box.balance

        const loan = box.getLoanByUUID(loanUid)

        const valuePayed = 4
        const member = Member.build({ name: 'jeanluca jeanlucajea', email: 'jeanlucafp@gmail.com' })
        const payment = new Payment({ member, value: valuePayed, description: 'Pago via Caixinha web' })
        loan.addPayment(payment)

        expect(currentBalance + valuePayed).toBe(box.balance)
        expect(0.08000000000000007).toBe(loan._remainingAmount)
    })

    it('should be abble to add performance on box', () => {
        const box = new Box()
        box.addPerformance(7.5)
        expect(box.balance).toBe(7.5)
    })

    it('should be abble remove member', () => {
        const box = new Box()
        const member = new Member('juca')

        box.joinMember(member)
        box.removeMember(member)
        expect(box.totalMembers).toBe(0)
    })

    it('cannot be abble to remove member because member has pending loan', () => {
        const box = new Box()
        const member = new Member('juca')
        box.joinMember(member)
        box.deposit(new Deposit({
            member,
            value: 25
        }))

        const input: CreateLoanInput = {
            member,
            valueRequested: 25,
            interest: 5,
            box,
            description: 'teste',
            installments: 4
        }

        const loan = new Loan(input)
        loan.addApprove(member)
        box.makeLoan(loan)
        
        expect(() => box.removeMember(member))
            .toThrow('Cannot continue because this member has pending loans')

        expect(box.totalMembers).toBe(1)
    })

    it('should be recalculate box balance', () => {
        const json = require('./box.json')
        const box = Box.fromJson(json)

        box.recalculateBalance()

        expect(25).toBe(box.balance)
    })

    it('cannot be able join member if box is locked', () => {
        const box = new Box()
        box.flipLock()
        expect(() => box.joinMember(new Member('juca'))).toThrow('This box is locked for new members')

        box.flipLock()
        box.joinMember(new Member('juca'))

        expect(box.totalMembers).toBe(1)
    })

    it('should allow the owner to remove their loan and prevent others from removing it', () => {
        const box = new Box()
        const owner = Member.build({ name: 'owner', email: 'owner@email.com' })
        const notOwner = Member.build({ name: 'notOwner', email: 'notowner@email.com' })
        box.joinMember(owner)
        box.joinMember(notOwner)
        box.deposit(new Deposit({ member: owner, value: 100 }))

        const input: CreateLoanInput = {
            member: owner,
            valueRequested: 50,
            interest: 0,
            box,
            description: 'test loan',
            installments: 1
        }
        const loan = new Loan(input)
        loan.addApprove(owner)
        box.makeLoan(loan)
        expect(box._loans.length).toBe(1)

        // Dono remove o empréstimo
        box.memberTryRemoveLoan(owner, loan.UUID)
        expect(box._loans.length).toBe(0)

        // Adiciona novamente para testar não-dono
        box.makeLoan(loan)
        expect(() => box.memberTryRemoveLoan(notOwner, loan.UUID)).toThrow('You are not the owner of this loan')
        expect(box._loans.length).toBe(1)
    })
})