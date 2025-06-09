import { Deposit } from "../../deposits/Deposit";
import { Member } from "../../members/Member";
import { DecimalValue } from "../../valueObjects/DecimalValue";
import { Box } from "../Box";

interface InactiveMember {
    member: Member
    lastDepositValue: DecimalValue
    lastActivity: Date
}

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

function isOlderThanThirtyDays(date: Date): boolean {
    const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_IN_MS);
    return date < thirtyDaysAgo;
}

function findLastDeposit(deposits: Deposit[], member: Member): Deposit | undefined {
    return deposits
        .filter(deposit => deposit._member._email === member._email)
        .sort((a, b) => b._date.getTime() - a._date.getTime())[0];
}

export default function GetInactiveMembers(box: Box): InactiveMember[] {
    return box._members
        .map(member => {
            const lastDeposit = findLastDeposit(box._deposits, member);
            if (!lastDeposit || !isOlderThanThirtyDays(lastDeposit._date)) {
                return undefined;
            }

            return {
                member,
                lastDepositValue: DecimalValue.from(lastDeposit._value),
                lastActivity: lastDeposit._date
            };
        })
        .filter((member): member is InactiveMember => member !== undefined);
}