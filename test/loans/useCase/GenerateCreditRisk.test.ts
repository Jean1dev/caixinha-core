import { Box } from "../../../src/boxes/Box"
import GenerateCreditRisk, { getLateLoans } from "../../../src/loans/useCase/GenerateCreditRisk"
import { Loan } from "../../../src/loans/Loan"
import { Member } from "../../../src/members/Member"
import { Payment } from "../../../src/payment/Payment"
import { DecimalValue } from "../../../src/valueObjects/DecimalValue"

class DummyBox extends Box { constructor(){super();} }

describe('GenerateCreditRisk', () => {
    it('Should generate the correct number of analyses', () => {
        const json = require('../../boxes/useCase/input2.json')
        const box = Box.fromJson(json)
        const result = GenerateCreditRisk(box._loans, box._members)
        expect(result.length).toBe(5)
    })

    it('Should detect loans with late payments', () => {
        const member = Member.build({ name: 'A' })
        const box = new DummyBox()
        const payment = new Payment({ member, value: 80, date: new Date('2024-02-02') })
        const loan = new Loan({
            member,
            valueRequested: 100,
            interest: 0,
            box,
            description: '',
            date: new Date('2023-12-01'),
            fees: 0,
            skipValidate: true,
            installments: 1
        })
        loan["payments"] = [payment]
        loan["totalValue"] = DecimalValue.from(100)
        loan["billingDates"] = [new Date('2024-01-01')]
        expect(getLateLoans([loan]).length).toBe(1)
    })

    it('Should not detect fully paid loan', () => {
        const member = Member.build({ name: 'A' })
        const box = new DummyBox()
        const payment = new Payment({ member, value: 100, date: new Date('2024-01-01') })
        const loan = new Loan({
            member,
            valueRequested: 100,
            interest: 0,
            box,
            description: '',
            date: new Date('2023-12-01'),
            fees: 0,
            skipValidate: true,
            installments: 1
        })
        loan["payments"] = [payment]
        loan["totalValue"] = DecimalValue.from(100)
        loan["billingDates"] = [new Date('2024-01-01')]
        expect(getLateLoans([loan]).length).toBe(0)
    })

    it('Should detect loans with no payments and past due', () => {
        const member = Member.build({ name: 'A' })
        const box = new DummyBox()
        const loan = new Loan({
            member,
            valueRequested: 100,
            interest: 0,
            box,
            description: '',
            date: new Date('1999-01-01'),
            fees: 0,
            skipValidate: true,
            installments: 1
        })
        loan["payments"] = []
        loan["totalValue"] = DecimalValue.from(100)
        loan["billingDates"] = [new Date('2000-01-01')]
        expect(getLateLoans([loan]).length).toBe(1)
    })

    it('Should not detect loans with no payments and not yet due', () => {
        const member = Member.build({ name: 'A' })
        const box = new DummyBox()
        const loan = new Loan({
            member,
            valueRequested: 100,
            interest: 0,
            box,
            description: '',
            date: new Date('2998-01-01'),
            fees: 0,
            skipValidate: true,
            installments: 1
        })
        loan["payments"] = []
        loan["totalValue"] = DecimalValue.from(100)
        loan["billingDates"] = [new Date('2999-01-01')]
        expect(getLateLoans([loan]).length).toBe(0)
    })

    it('Should not detect partially paid loan before due date', () => {
        const member = Member.build({ name: 'B' })
        const box = new DummyBox()
        const payment = new Payment({ member, value: 10, date: new Date('2024-01-01') })
        const loan = new Loan({
            member,
            valueRequested: 100,
            interest: 0,
            box,
            description: '',
            date: new Date('2024-01-01'),
            fees: 0,
            skipValidate: true,
            installments: 1
        })
        loan["payments"] = [payment]
        loan["totalValue"] = DecimalValue.from(100)
        const futureDue = new Date()
        futureDue.setFullYear(futureDue.getFullYear() + 1)
        loan["billingDates"] = [futureDue]
        expect(getLateLoans([loan]).length).toBe(0)
    })
})