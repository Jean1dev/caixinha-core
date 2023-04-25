export class DecimalValue {
    private value: number

    constructor(value: number) {
        if (value === null || value === undefined) {
            throw new Error('Value cannot be null or undefined')
        }

        this.value = value
    }

    public get val() {
        return this.value
    }
}
