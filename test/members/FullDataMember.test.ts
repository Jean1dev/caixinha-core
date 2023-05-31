import { FullDataMember, Member } from "../../src"
import { IFullDataMemberJson } from "../../src/members/FullDataMember"

describe('FullDataMember test', () => {
    it('shoud be create correctly', () => {
        let member = FullDataMember.fromMember(Member.build({ name: 'jean', email: 'jean@jean' }))
        expect(member.memberName).toBe('jean')
        expect(member._email).toBe('jean@jean')

        member._phoneNumber = '+5548998457797'

        member.addBankAccount('pix qualquer', 'qrcode')

        const json: IFullDataMemberJson = {
            "name": "jean"
        }

        member = FullDataMember.fromJson(json)
        expect(member.memberName).toBe('jean')

        const list = [
            Member.build({ name: 'c', email: 'c'}),
            Member.build({ name: 'j', email: 'j'}),
            Member.build({ name: 'h', email: 'h'})
        ]

        const members = FullDataMember.fromListMember(list)
        expect(members).toHaveLength(3)
        expect(members[0].memberName).toBe('c')
        expect(members[0]._email).toBe('c')

        expect(members[1].memberName).toBe('j')
        expect(members[1]._email).toBe('j')

        expect(members[2].memberName).toBe('h')
        expect(members[2]._email).toBe('h')
    })
})