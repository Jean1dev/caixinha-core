import { Member, Payment } from '../../src/index'

it('shoud be create a payment', () => {
    new Payment(new Member('juca'), 25)
})