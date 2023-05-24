import { CreateDepositInput, Deposit } from '../../src/deposits/Deposit'
import { Member } from '../../src/members/Member'

describe('Deposit class test', () => {
    it('should be create deposit', () => {
        function getDataDeOntem() {
            const hoje = new Date()
            const ontem = new Date(hoje)
            ontem.setDate(hoje.getDate() - 1)
            return ontem
        }

        const input: CreateDepositInput = {
            date: getDataDeOntem(),
            member: new Member('jean'),
            value: 23
        }

        const deposit = new Deposit(input)
        expect(deposit).not.toBe(null)
        expect(input.value).toBe(deposit._value)
    })

    it('should nnot be create deposito because has validations erros', () => {
        const input: CreateDepositInput = {
            //@ts-ignore
            member: undefined,
            value: -2
        }

        try {
            new Deposit(input)
        } catch (ex) {
            expect('value cannot be 0 or lower, member cannot be null').toEqual(ex.message)
        }
    
    })
})