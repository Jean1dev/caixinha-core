export class BankAccount {
    private keysPix: string[]
    private urlsQrCodePix: string[]

    constructor(keysPix: string[], urlsQrCodePix: string[]) {
        this.keysPix = keysPix
        this.urlsQrCodePix = urlsQrCodePix
    }

    public add(keyPix: string, qrCode: string) {
        if (keyPix)
            this.keysPix.push(keyPix)

        if (qrCode)
            this.urlsQrCodePix.push(qrCode)
    }
}