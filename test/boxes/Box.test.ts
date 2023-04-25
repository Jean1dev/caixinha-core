import { Box } from '../../src/boxes/Box'
import { Deposit } from '../../src/deposits/Deposit'
import { Member } from '../../src/members/Member'

describe('Box class test', () => {
    it('should be create a Box', () => {
        const box = new Box()
        expect(0.0).toBe(box.balance)
    })

    it('should be possible make a deposit', () => {
        const box = new Box()
        const deposit = new Deposit({
            member: new Member('juca'),
            value: 25
        })

        box.deposit(deposit)

        expect(deposit._value).toBe(box.balance)

        const anotherDeposit = new Deposit({
            member: new Member('juca'),
            value: 25.89
        })

        box.deposit(anotherDeposit)

        expect(50.89).toBe(box.balance)
    })
})