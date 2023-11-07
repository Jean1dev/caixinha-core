import { Member } from "../../members/Member";
import { DecimalValue } from "../../valueObjects/DecimalValue";
import { Box } from "../Box";

interface IReportPendingLoan {
    member: Member
    valuePending: DecimalValue
    loanUid: string[]
}

export default function ReportPendingLoan(box: Box): IReportPendingLoan[] {
    const pending = box._loans.filter(lo => !(lo._isPaidOff))
    const result: IReportPendingLoan[] = []

    box['members'].forEach(member => {
        const membersLoan = pending.filter(loa => loa._member.memberName === member.memberName)
        if (membersLoan.length > 0) {
            const total = membersLoan.map(lo => lo._remainingAmount).reduce((sum, value) => sum + value, 0)
            result.push({
                member,
                valuePending: DecimalValue.from(total),
                loanUid: membersLoan.map(lo => lo.UUID)
            })
        }
    })

    return result
}