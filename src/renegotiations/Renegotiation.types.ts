import { FromBoxInput } from "../loans/loan.types";

export interface RenegotiationJsonType {
    oldLoan:     FromBoxInput;
    newLoan?:    FromBoxInput;
    createdAt:   Date;
    finishedAt?:  Date;
    status:      'PENDING' | 'FINISHED';
    delayedDays: number;
}