import { Payment } from '../../src'
import { Box } from '../../src/boxes/Box'
import { Deposit } from '../../src/deposits/Deposit'
import { CreateLoanInput, Loan } from '../../src/loans/Loan'
import { Member } from '../../src/members/Member'

describe('Loan class test', () => {
    it('shoul be create succesfuly', () => {
        function getDate30DaysFromHere() {
            const hoje = new Date()
            const dataDaqui30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
            return dataDaqui30Dias
        }

        const member = new Member('juca')

        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.joinMember(member)
        box.joinMember(new Member('carlos'))
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 1000,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        expect(loan).not.toBe(null)
        expect(loan.listOfBillingDates[0].getDate()).toBe(getDate30DaysFromHere().getDate())

        loan.addApprove()
        expect(false).toBe(loan.isApproved)
    })

    it('should be not create Loan becausa has validations erros', () => {
        const input: CreateLoanInput = {
            member: null as unknown as Member,
            valueRequested: -1,
            interest: 5,
            box: null as unknown as Box
        }

        try {
            new Loan(input)
        } catch (ex) {
            expect(
                'value cannot be lower than 0, member cannot be null, box cannot be null'
            ).toBe(ex.message)
        }
    })

    it('shoud not be abble to apply loan because box does not have funds', () => {
        const member = new Member('juca')

        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 10
        })

        box.joinMember(member)
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 1000,
            interest: 5,
            box
        }

        try {
            new Loan(input)
        } catch (error) {
            expect('box does not have enough funds').toBe(error.message)
        }
    })

    it('should be complete a loan', () => {
        const member = new Member('juca')
        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.joinMember(member)
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        loan.addApprove()

        expect(50).toBe(box.balance)
    })

    it('should be able to make a payment', () => {
        const member = new Member('juca')
        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })
        box.joinMember(member)
        box.deposit(deposit)
        const input: CreateLoanInput = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        loan.addApprove()
        loan.addPayment(new Payment(member, 950))
        expect(1000).toBe(box.balance)
    })

    it('shoud be apply all rules for add payment', () => {
        const member = new Member('juca')
        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })
        box.joinMember(member)
        box.deposit(deposit)
        const input: CreateLoanInput = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)

        try {
            loan.addPayment(new Payment(new Member('carlos'), 950))
        } catch (error) {
            expect('Payment member not apply for this Loan').toBe(error.message)
        }

        box.joinMember(new Member('jean'))
        try {
            loan.addPayment(new Payment(member, 950))
        } catch (error) {
            expect('This loan is not approved yet').toBe(error.message)
        }
    })

    it('should be verify if loan is paid off', () => {
        const member = new Member('juca')
        const box = new Box()

        box.joinMember(member)
        box.deposit(new Deposit({
            member,
            value: 1000
        }))

        const input: CreateLoanInput = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        loan.addApprove()
        loan.addPayment(new Payment(member, 950))

        expect(false).toBe(loan.isPaidOff)

        loan.addPayment(new Payment(member, 47.50))
        expect(true).toBe(loan.isPaidOff)
    })
})