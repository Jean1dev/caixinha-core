import { BankAccount } from "../valueObjects/BankAccount"

export interface BoxJsonType {
  _id: Id
  members: MemberJson[]
  currentBalance: CurrentBalance
  deposits: any[]
  loans: LoanBoxJson[]
  bankAccount?: IBankAccount
  name?: string
}

export interface IBankAccount {
  keysPix: string[]
  urlsQrCodePix: string[]
}

export interface Id {
  $oid: string
}

export interface MemberJson {
  name: string
  email: string
}

export interface CurrentBalance {
  value: number
}

export interface LoanBoxJson {
  approved: boolean
  member: MemberJson
  listOfMembersWhoHaveAlreadyApproved: MemberJson[]
  date: string
  valueRequested: ValueRequested
  totalValue: { value: number }
  remainingAmount: { value: number }
  fees: Fees
  interest: Interest
  box: any
  approvals: number
  description: string
  payments: any[]
  memberName: string
  requiredNumberOfApprovals: number
  billingDates: string[]
  uid: string
}

export interface ValueRequested {
  value: number
}

export interface Fees {
  value: number
}

export interface Interest {
  value: number
}

export interface Date3 {
  $numberLong: string
}
