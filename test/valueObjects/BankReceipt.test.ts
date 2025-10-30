import { BankReceipt } from "../../src/valueObjects/BankReceipt"

describe('BankReceipt', () => {
    it('should instantiate with url', () => {
        const receipt = new BankReceipt('https://example.com/receipt.png')
        expect(receipt).toBeInstanceOf(BankReceipt)
    })
})
