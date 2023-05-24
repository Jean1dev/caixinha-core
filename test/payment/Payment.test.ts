import { Member, Payment } from '../../src/index'

it('shoud be create a payment', () => {
    const payment = new Payment({
        member: new Member('juca'),
        value: 25
    })

    expect(payment).not.toBeNull()
})