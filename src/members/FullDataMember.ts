import { BankAccount } from "../valueObjects/BankAccount";
import { Member } from "./Member";

export interface IFullDataMemberJson {
    name: string
    email?: string
    phoneNumber?: string
    bankAccount?: {
        keysPix: string[]
        urlsQrCodePix: string[]
    }
}

export class FullDataMember extends Member {

    private phoneNumber: string
    private bankAccount: BankAccount

    private constructor(
        name: string,
        email: string
    ) {
        super(name);
        this.email = email
    }

    public static fromMember(member: Member): FullDataMember {
        return new FullDataMember(
            member.memberName,
            member._email
        )
    }

    public static fromListMember(members: Member[]): FullDataMember[] {
        return members.map(this.fromMember)
    }

    public static fromJson(json: IFullDataMemberJson): FullDataMember {
        const member = new FullDataMember(json.name, json.email)
        member.phoneNumber = json.phoneNumber
        
        if (json.bankAccount)     {
            member.bankAccount = new BankAccount(json.bankAccount.keysPix, json.bankAccount.urlsQrCodePix)
        }
        
        return member
    }

    public set _phoneNumber(number: string) {
        this.phoneNumber = number
    }

    public addBankAccount(keyPix: string | null, qrCode: string | null) {
        if (!this.bankAccount) {
            this.bankAccount = new BankAccount([], [])
        }

        this.bankAccount.add(keyPix, qrCode)
    }
}