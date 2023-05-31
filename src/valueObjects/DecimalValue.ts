export class DecimalValue {
    private value: number

    private constructor(value: number) {
        if (value === null || value === undefined) {
            throw new Error('Value cannot be null or undefined')
        }

        this.value = value
    }

    public static from(value: any): DecimalValue {
        if (value == null || value == undefined) {
            return new DecimalValue(null)
        }

        if (value instanceof DecimalValue) {
            return new DecimalValue(value.val)
        }

        if (typeof value == 'number') {
            return new DecimalValue(value)
        }

        if ('value' in value) {
            return new DecimalValue(value.value)
        }
    }

    public get val() {
        return this.value
    }
}
