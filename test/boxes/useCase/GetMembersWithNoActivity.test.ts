import { Box } from "../../../src/boxes/Box";
import { Member } from "../../../src/members/Member";
import { Deposit } from "../../../src/deposits/Deposit";
import GetInactiveMembers from "../../../src/boxes/useCase/GetInactiveMembers";

describe("GetInactiveMembers", () => {
    let box: Box;
    let member1: Member;
    let member2: Member;
    let member3: Member;

    beforeEach(() => {
        member1 = Member.build({ name: "Member 1", email: "member1@test.com" });
        member2 = Member.build({ name: "Member 2", email: "member2@test.com" });
        member3 = Member.build({ name: "Member 3", email: "member3@test.com" });
        
        box = new Box();
        box.joinMember(member1);
        box.joinMember(member2);
        box.joinMember(member3);
    });

    it("should return empty array when there are no deposits", () => {
        const result = GetInactiveMembers(box);
        expect(result).toHaveLength(0);
    });

    it("should return members with deposits older than thirty days", () => {
        const recentDate = new Date();
        const oldDate = new Date();
        oldDate.setMonth(oldDate.getMonth() - 2);

        const deposit1 = new Deposit({
            member: member1,
            value: 100,
            date: oldDate
        });
        const deposit2 = new Deposit({
            member: member2,
            value: 200,
            date: recentDate
        });
        const deposit3 = new Deposit({
            member: member3,
            value: 300,
            date: oldDate
        });

        box.deposit(deposit1);
        box.deposit(deposit2);
        box.deposit(deposit3);

        const result = GetInactiveMembers(box);
        
        expect(result).toHaveLength(2);
        expect(result[0].member._email).toBe(member1._email);
        expect(result[1].member._email).toBe(member3._email);
    });

    it("should return only the most recent deposit for each inactive member", () => {
        const oldDate = new Date();
        oldDate.setMonth(oldDate.getMonth() - 2);
        const olderDate = new Date(oldDate);
        olderDate.setDate(olderDate.getDate() - 15);

        const deposit1 = new Deposit({
            member: member1,
            value: 100,
            date: olderDate
        });
        const deposit2 = new Deposit({
            member: member1,
            value: 200,
            date: oldDate
        });
        const deposit3 = new Deposit({
            member: member2,
            value: 300,
            date: new Date()
        });

        box.deposit(deposit1);
        box.deposit(deposit2);
        box.deposit(deposit3);

        const result = GetInactiveMembers(box);
        
        expect(result).toHaveLength(1);
        expect(result[0].lastDepositValue.val).toBe(200);
    });

    it("should not include members with deposits within last thirty days", () => {
        const recentDate = new Date();
        const olderDate = new Date();
        olderDate.setDate(olderDate.getDate() - 15);

        const deposit1 = new Deposit({
            member: member1,
            value: 100,
            date: recentDate
        });
        const deposit2 = new Deposit({
            member: member2,
            value: 200,
            date: olderDate
        });

        box.deposit(deposit1);
        box.deposit(deposit2);

        const result = GetInactiveMembers(box);
        expect(result).toHaveLength(0);
    });
}); 