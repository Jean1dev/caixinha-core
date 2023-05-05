export class DecimalValue {
    private value: number

    constructor(value: number) {
        if (value === null || value === undefined) {
            throw new Error('Value cannot be null or undefined')
        }

        this.value = value
    }

    public static from(value: any) {
        if (value instanceof DecimalValue) {
            return new DecimalValue(value.val)
        }

        return new DecimalValue(value)
    }

    public get val() {
        return this.value
    }
}
