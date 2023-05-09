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

        if (typeof value == 'number') {
            return new DecimalValue(value)
        }

        if ('value' in value) {
            return new DecimalValue(value.value)
        }

        return new DecimalValue(null)
    }

    public get val() {
        return this.value
    }
}
