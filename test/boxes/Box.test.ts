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

    it('should be able to create box from another box', () => {
        const box = new Box()
        const deposit = new Deposit({
            member: new Member('juca'),
            value: 25
        })

        box.deposit(deposit)


        const anotherBox = Box.from(box)
        expect(25).toBe(anotherBox.balance)
        expect(0).toBe(anotherBox.totalMembers)
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
})