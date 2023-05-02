import { Member } from '../../src/members/Member'

describe('Member class test', () => {
    it('should be create Member', () => {
        const name = 'jean'
        const member = new Member(name)
        expect(member).not.toBe(null)
        expect(member.memberName).toBe(name)
    })

    it('should be create Member by static method', () => {
        const name = 'jean'
        const member = Member.build({
            name,
            email: 'jean@jean'
        })
        expect(member).not.toBe(null)
        expect(member.memberName).toBe(name)
    })

    it('shoud be throw exception because name is empty', () => {
        try {
            new Member('')
        } catch (ex) {
            expect('Name cannot be null or empty').toBe(ex.message)
        }
    })
})