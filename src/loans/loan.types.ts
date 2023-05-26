import { Box } from "../boxes/Box"
import { Member } from "../members/Member"

export interface FromBoxInput {
  approved: boolean
  member: Member
  date: string
  valueRequested: { value: number }
  remainingAmount: { value: number }
  totalValue: { value: number }
  fees: { value: number }
  interest: { value: number }
  box: Box
  approvals: number
  description: string
  payments: any[]
  memberName: string
  requiredNumberOfApprovals: number
  billingDates: string[]
  uid: string
  listOfMembersWhoHaveAlreadyApproved: Member[]
  isPaidOff?: boolean
  installments?: number
}

export interface CreateLoanInput {
  member: Member
  valueRequested: number
  interest: number
  box: Box
  description?: string
  date?: Date
  fees?: number
  skipValidate?: boolean
  installments?: number
}