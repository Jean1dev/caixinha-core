import { Payment } from '../../src'
import { Box } from '../../src/boxes/Box'
import { Deposit } from '../../src/deposits/Deposit'
import { Loan } from '../../src/loans/Loan'
import { CreateLoanInput, FromBoxInput } from '../../src/loans/loan.types'
import { Member } from '../../src/members/Member'
import { getDataMais30Dias } from '../testUtils'

describe('Loan class test', () => {
    it('should be create succesfuly', () => {
        const member = new Member('juca')

        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.joinMember(member)

        const carlos = new Member('carlos')
        box.joinMember(carlos)
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 1000,
            interest: 5,
            box,
            description: 'teste',
        }

        const loan = new Loan(input)
        expect(loan).not.toBe(null)
        expect(loan.listOfBillingDates[0].getDate()).toBe(getDataMais30Dias().getDate())

        loan.addApprove(carlos)
        expect(false).toBe(loan.isApproved)
    })

    it('should be not create Loan becausa has validations erros', () => {
        const input: CreateLoanInput = {
            member: null as unknown as Member,
            valueRequested: -1,
            interest: 5,
            box: null as unknown as Box,
            installments: -2
        }


        expect(() => new Loan(input))
            .toThrow('value cannot be lower than 0, intallments cannot be lower than 0, member cannot be null, box cannot be null')
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
        loan.addApprove(member)

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
        loan.addApprove(member)
        loan.addPayment(new Payment({ member, value: 950 }))
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
            loan.addPayment(new Payment({ member: new Member('carlos'), value: 950 }))
        } catch (error) {
            expect('Payment member not apply for this Loan').toBe(error.message)
        }

        box.joinMember(new Member('jean'))
        try {
            loan.addPayment(new Payment({ member, value: 950 }))
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
        loan.addApprove(member)
        loan.addPayment(new Payment({ member, value: 950 }))

        expect(false).toBe(loan._isPaidOff)

        loan.addPayment(new Payment({ member, value: 47.50 }))
        expect(true).toBe(loan._isPaidOff)
    })

    it('shoud be not approve this loan becausa member has no party of loan`s box', () => {
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

        expect(() => loan.addApprove(new Member('carlos'))).toThrow('This member cannot approve this loan because he is no member of this box')
    })

    it('member cannot be approve loan more than once time', () => {
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

        const joaoJilberto = new Member('joaoJilberto')
        box.joinMember(joaoJilberto)
        const loan = new Loan(input)

        loan.addApprove(joaoJilberto)
        expect(() => loan.addApprove(joaoJilberto)).toThrow('This member have already approve this loan')
    })

    it('shoud be abble to make a loan with installments', () => {
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
            description: 'teste',
            installments: 4
        }

        function getDate30Days(today = new Date()) {
            const dataDaqui30Dias = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
            return dataDaqui30Dias
        }

        const firstInstallment = getDate30Days()
        const secondInstallment = getDate30Days(firstInstallment)
        const thirdInstallment = getDate30Days(secondInstallment)
        const fourthInstalment = getDate30Days(thirdInstallment)

        const loan = new Loan(input)

        expect(loan.listOfBillingDates).toHaveLength(4)
        expect(loan.listOfBillingDates[0]).toEqual(firstInstallment)
        expect(loan.listOfBillingDates[1]).toEqual(secondInstallment)
        expect(loan.listOfBillingDates[2]).toEqual(thirdInstallment)
        expect(loan.listOfBillingDates[3]).toEqual(fourthInstalment)
    })

    it('shoud be create Loan correcty fromBoxJson', () => {
        const member = new Member('jean')
        const box = new Box()
        box.joinMember(member)
        const payments = [new Payment({
            member,
            value: 2
        })]

        const boxJson: FromBoxInput = {
            approved: true,
            member,
            date: new Date().toISOString(),
            valueRequested: { value: 25 },
            remainingAmount: { value: 25 },
            totalValue: { value: 27 },
            fees: { value: 2 },
            interest: { value: 0 },
            box,
            approvals: 1,
            description: `string`,
            payments,
            memberName: 'jean',
            requiredNumberOfApprovals: 1,
            billingDates: [],
            uid: 'string',
            listOfMembersWhoHaveAlreadyApproved: [member],
            isPaidOff: false,
            installments: 2
        }

        const loan = Loan.fromBox(boxJson)
        expect(loan['payments'].length).toBe(1)
        expect(loan._remainingAmount).toBe(25)
    })

    it('should be abble to refuse loan', () => {
        const member = new Member('juca')

        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.joinMember(member)

        const carlos = new Member('carlos')
        box.joinMember(carlos)
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 1000,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        const mustBeTrue = loan.refuse('nao acho justo', member)
        expect(mustBeTrue).toBe(true)

        expect(() => loan.addApprove(member)).toThrow('This loan is refused')
    })

    it('should not be abble refuse loan with member outside the box', () => {
        const member = new Member('juca')

        const box = new Box()
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.joinMember(member)

        const carlos = new Member('carlos')
        box.joinMember(carlos)
        box.deposit(deposit)

        const input: CreateLoanInput = {
            member,
            valueRequested: 1000,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        const mustBeFalse = loan.refuse('nao acho justo', new Member('joao'))
        expect(mustBeFalse).toBe(false)
    })

    it('should validate memberCanCanceledThisLoan logic', () => {
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

        // Não aprovado, não quitado: dono pode cancelar
        expect(loan.memberCanCanceledThisLoan(owner)).toBe(true)
        // Não aprovado, não quitado: não-dono não pode cancelar
        expect(loan.memberCanCanceledThisLoan(notOwner)).toBe(false)

        // Aprova o empréstimo com ambos os membros
        loan.addApprove(owner)
        loan.addApprove(notOwner)
        // Agora está aprovado, não quitado: dono não pode cancelar
        expect(loan.memberCanCanceledThisLoan(owner)).toBe(false)

        // Quitando o empréstimo via pagamento
        loan.addPayment(new Payment({ member: owner, value: loan._totalValue }))
        // Quitado: dono pode cancelar
        expect(loan.memberCanCanceledThisLoan(owner)).toBe(true)
    })
})