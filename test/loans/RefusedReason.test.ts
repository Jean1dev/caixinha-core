import { Member } from "../../src"
import { RefusedReason } from "../../src/loans/RefusedReason"
import { RefusedReasonJson } from "../../src/loans/loan.types"

describe('RefusedReason tests cases', () => {
    it('should be create correctly', () => {
        const reason = new RefusedReason(new Member('jean'), 'cancelei pq no tem galantia')
        expect(reason).not.toBeNull()
        expect(reason['createdAt']).not.toBeNull()
        expect(reason['member']).not.toBeNull()
        expect(reason['reason']).not.toBeNull()
        expect(reason['reason']).toBe('cancelei pq no tem galantia')
    })

    it('should be throw error because reason length is greater than 255 ', () => {
        const bigReason = 'a'.repeat(256)
        expect(() => new RefusedReason(new Member('jean'), bigReason))
            .toThrowError('Reason must be less than 255 characters')
    })

    it('should be create correctly from json type', () => {
        const jsonType: RefusedReasonJson = {
            createdAt: new Date().toISOString(),
            reason: 'reason aleatoria',
            member: {
                email: 'XXXXXXXXXXXXXX',
                name: 'XXXXXXXXXXXXXX',
            }
        }

        const reason = RefusedReason.fromJson(jsonType)
        expect(reason).not.toBeNull()
        expect(reason['createdAt']).not.toBeNull()
        expect(reason['member']).not.toBeNull()
        expect(reason['reason']).not.toBeNull()
        expect(reason['reason']).toBe('reason aleatoria')
        expect(reason['member']['email']).toBe('XXXXXXXXXXXXXX')
        expect(reason['member']['name']).toBe('XXXXXXXXXXXXXX')
    })
})