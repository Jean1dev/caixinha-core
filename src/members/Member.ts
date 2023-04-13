export class Member {

    private name: string

    constructor(name: string) {
        this.name = name
        this.validate(true)
    }

    public validate(throwIFException = false): String[] {
        const notificationMessages = []
        if (!this.name || this.name.trim() === '') {
            notificationMessages.push('Name cannot be null or empty')
        }

        if (throwIFException && notificationMessages.length > 0) {
            const errorMessage = notificationMessages.join(', ')
            throw new Error(errorMessage)
        }

        return notificationMessages
    }

    public get memberName(): string {
        return this.name
    }
}