import {
    Member,
    Box,
    Deposit,
    Loan,
    Payment,
    Renegotiation
} from "../../src"
import { FromBoxInput } from "../../src/loans/loan.types";
import { RenegotiationJsonType } from "../../src/renegotiations/Renegotiation.types";
import { getDataMenos30Dias, getDataMenosDias } from "../testUtils";

function validLoanForRenegotiation() {
    const member = new Member('fake')
    const box = new Box()
    box.joinMember(member)

    const input: FromBoxInput = {
        approved: true,
        member,
        date: getDataMenos30Dias().toString(),
        totalValue: { value: 10 },
        valueRequested: { value: 10 },
        remainingAmount: { value: 10 },
        fees: { value: 0 },
        interest: { value: 0 },
        box,
        description: 'fake',
        approvals: 1,
        memberName: member.memberName,
        requiredNumberOfApprovals: 0,
        billingDates: [ getDataMenos30Dias().toString() ],
        uid: 'uid',
        listOfMembersWhoHaveAlreadyApproved: [ member],
        payments: []
    }

    const loan = Loan.fromBox(input)

    return {
        loan,
        box,
        member
    }
}

describe('Renegotiation Test', () => {

    it('cannot create renegotiation because loan already paid', () => {
        const member = new Member('juca')
        const box = new Box()
        box.joinMember(member)
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.deposit(deposit)
        const input = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste'
        }

        const loan = new Loan(input)
        loan.addApprove(member)
        loan.addPayment(new Payment({ member, value: 1000 }))

        expect(() =>
            Renegotiation.create(loan))
            .toThrow('loan has already been paid')
    })

    it('cannot create renegotiation because loan is not approved', () => {
        const member = new Member('juca')
        const box = new Box()
        box.joinMember(member)
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.deposit(deposit)
        const input = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste',
        }

        const loan = new Loan(input)

        expect(() =>
            Renegotiation.create(loan))
            .toThrow('loan is not approved')
    })

    it('cannot create renegotiation because loan is not late', () => {
        const member = new Member('juca')
        const box = new Box()
        box.joinMember(member)
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.deposit(deposit)
        const input = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste',
            date: getDataMenosDias(1)
        }

        const loan = new Loan(input)
        loan.addApprove(member)

        expect(() =>
            Renegotiation.create(loan))
            .toThrow('Loan is not late, it is not possible to renegotiate')
    })

    it('cannot create renegotiation because loan payment date is in the future', () => {
        const member = new Member('juca')
        const box = new Box()
        box.joinMember(member)
        const deposit = new Deposit({
            member,
            value: 1000
        })

        box.deposit(deposit)
        
        // Cria empréstimo com data futura (daqui a 5 dias)
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 5)
        
        const input = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste',
            date: futureDate
        }

        const loan = new Loan(input)
        loan.addApprove(member)

        expect(() =>
            Renegotiation.create(loan))
            .toThrow('Loan is not late, it is not possible to renegotiate')
    })

    it('Should be create with success', () => {
        const { loan } = validLoanForRenegotiation()
        const o = Renegotiation.create(loan)
        expect(o).toBeInstanceOf(Renegotiation)
        expect(o['status']).toBe('PENDING')
        expect(o.originLoan.UUID).toBe(loan.UUID)
        expect(o['createdAt']).not.toBeNull()
    })

    it('Should be complete renegotiation', () => {
        const { loan, member, box } = validLoanForRenegotiation()
        const o = Renegotiation.create(loan)

        const input = {
            member,
            valueRequested: 950,
            interest: 5,
            box,
            description: 'teste',
            skipValidate: true
        }

        const newLoan = new Loan(input)
        o.complete(newLoan)

        expect(o['status']).toBe('FINISHED')
        expect(o['finishedAt']).not.toBeNull()
        expect(o['newLoan']['UUID']).toBe(newLoan.UUID)
    })

    it('should be create correctly by json', () => {
        const json = require('./reneg.json')
        const o = Renegotiation.fromJson(json as unknown as RenegotiationJsonType)
        expect(o['status']).toBe('PENDING')
        expect(o['createdAt']).not.toBeNull()
        expect(o['oldLoan']['UUID']).toBe(json['oldLoan']['uid'])
        expect(o['finishedAt']).toBe(null)
        expect(o['newLoan']).toBe(null)
    })
})