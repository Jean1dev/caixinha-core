export interface BoxJsonType {
    _id: Id
    members: MemberJson[]
    currentBalance: CurrentBalance
    deposits: any[]
    loans: LoanBoxJson[]
    bankAccount: any
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
    date: string
    valueRequested: ValueRequested
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
  