import DomainError from "../error/DomainError";
import { Member } from "../members/Member";
import { stringToDate } from "../utils";
import { RefusedReasonJson } from "./loan.types";

export class RefusedReason {
    private member: Member
    private reason: string
    private createdAt: Date

    static fromJson(input: RefusedReasonJson): RefusedReason {
        const object = new RefusedReason(
            Member.build({ name: input.member.name, email: input.member.email }),
            input.reason
        )

        object.createdAt = stringToDate(input.createdAt)
        return object
    }

    constructor(member: Member, reason: string) {
        this.member = member
        this.reason = reason
        this.validate()
        this.createdAt = new Date()
    }

    validate() {
        if (!this.member) {
            throw new DomainError('Member is required')
        }

        if (!this.reason) {
            throw new DomainError('Reason is required')
        }

        if (this.reason.length > 255) {
            throw new DomainError('Reason must be less than 255 characters')
        }
    }
}