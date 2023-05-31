export interface CreatMemberInput {
    name: string
    email?: string
}

export class Member {

    protected name: string
    protected email: string

    constructor(name: string) {
        this.name = name
        this.validate(true)
    }

    public static build(input: CreatMemberInput): Member {
        const m = new Member(input.name)
        m.email = input.email
        return m
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

    public get _email() {
        return this.email
    }
}