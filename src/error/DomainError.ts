export default class DomainError extends Error {
    private language = 'en-US'
    
    constructor(message: string) {
        super(message)
    }
}